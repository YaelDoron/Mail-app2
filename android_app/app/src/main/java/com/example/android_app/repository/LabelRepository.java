package com.example.android_app.repository;

import android.app.Application;
import android.util.Log;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_app.api.LabelApi;
import com.example.android_app.api.RetrofitClient;
import com.example.android_app.core.AppDatabase;
import com.example.android_app.dao.LabelDao;
import com.example.android_app.dao.UserDao;
import com.example.android_app.entity.Label;
import com.example.android_app.entity.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

public class LabelRepository {
    private static LabelRepository instance;

    private final UserDao userDao;
    private final LabelDao labelDao;
    private final LabelApi labelApi;

    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);

    public interface FetchLabelsCallback {
        void onError(String errorMsg);
        void onLabelsFetched(List<Label> labels);
    }

    private LabelRepository(Application application) {
        AppDatabase db = AppDatabase.getInstance(application);
        labelDao = db.labelDao();
        userDao = db.userDao();
        labelApi = RetrofitClient.getClient().create(LabelApi.class);
    }

    public static synchronized LabelRepository getInstance(Application application) {
        if (instance == null) {
            instance = new LabelRepository(application);
        }
        return instance;
    }

    public LiveData<List<Label>> getLabelLiveData(String userId) {
        return labelDao.getAllLabels(userId);
    }

    public void fetchLabels(FetchLabelsCallback callback) {
        isLoading.postValue(true);

        AppDatabase.databaseWriteExecutor.execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) {
                isLoading.postValue(false);
                postError("User not logged in", callback);
                return;
            }

            String token = "Bearer " + user.getToken();

            labelApi.getLabels(token).enqueue(new Callback<List<Label>>() {
                @Override
                public void onResponse(Call<List<Label>> call, Response<List<Label>> response) {
                    isLoading.postValue(false);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Label> labels = response.body();
                        for (Label label : labels) {
                            label.setOwner(user.getId());
                        }
                        AppDatabase.databaseWriteExecutor.execute(() -> {
                            labelDao.clear();
                            labelDao.insertAll(labels);
                            callback.onLabelsFetched(labels);
                        });
                    } else {
                        postError("Failed to fetch labels: " + response.code(), callback);
                    }
                }

                @Override
                public void onFailure(Call<List<Label>> call, Throwable t) {
                    isLoading.postValue(false);
                    postError("Fetch failed: " + t.getMessage(), callback);
                }
            });
        });
    }

    public void addLabel(Label label, Consumer<Label> onSuccess) {
        AppDatabase.databaseWriteExecutor.execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) {
                errorMessage.postValue("Label cannot be empty.");
                return;
            }

            String token = "Bearer " + user.getToken();

            labelApi.addLabel(token, label).enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        fetchLabels(new FetchLabelsCallback() {
                            @Override
                            public void onLabelsFetched(List<Label> labels) {
                                if (onSuccess != null) onSuccess.accept(label);
                            }

                            @Override
                            public void onError(String errorMsg) {}
                        });
                    } else {
                        errorMessage.postValue("Failed to add label: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    errorMessage.postValue("Add failed: " + t.getMessage());
                }
            });
        });
    }

    public void deleteLabel(String labelId) {
        AppDatabase.databaseWriteExecutor.execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) {
                errorMessage.postValue("User not loaded yet.");
                return;
            }

            String token = "Bearer " + user.getToken();

            labelApi.deleteLabel(token, labelId).enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        AppDatabase.databaseWriteExecutor.execute(() -> {
                            labelDao.deleteById(labelId);
                            fetchLabels(new FetchLabelsCallback() {
                                @Override
                                public void onLabelsFetched(List<Label> labels) {}
                                @Override
                                public void onError(String errorMsg) {}
                            });
                        });
                    } else {
                        errorMessage.postValue("Failed to delete label: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    errorMessage.postValue("Delete failed: " + t.getMessage());
                }
            });
        });
    }

    public void updateLabel(Label label) {
        AppDatabase.databaseWriteExecutor.execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) {
                errorMessage.postValue("User not logged in");
                return;
            }

            String token = "Bearer " + user.getToken();

            Map<String, String> nameMap = new HashMap<>();
            nameMap.put("name", label.getName());

            labelApi.updateLabel(token, label.getId(), nameMap).enqueue(new Callback<Label>() {
                @Override
                public void onResponse(Call<Label> call, Response<Label> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        Label updatedLabel = response.body();
                        updatedLabel.setOwner(user.getId()); // ✅ REQUIRED or Room query fails

                        AppDatabase.databaseWriteExecutor.execute(() -> {
                            labelDao.deleteById(updatedLabel.getId());
                            labelDao.insert(updatedLabel);
                            Log.d("LabelRepo", "Inserted updated label into DB: " + updatedLabel.getName());
                        });
                    } else {
                        errorMessage.postValue("Update failed: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<Label> call, Throwable t) {
                    errorMessage.postValue("Update failed: " + t.getMessage());
                }
            });
        });
    }

    private void postError(String msg, FetchLabelsCallback callback) {
        errorMessage.postValue(msg);
        callback.onError(msg);
    }
}