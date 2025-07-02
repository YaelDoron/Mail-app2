package com.example.android_app.repository;

import android.app.Application;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_app.AppDatabase;
import com.example.android_app.api.LabelApi;
import com.example.android_app.api.RetrofitClient;
import com.example.android_app.dao.LabelDao;
import com.example.android_app.entity.Label;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import java.util.HashMap;
import java.util.Map;


public class LabelRepository {

    private final LabelApi labelApi;
    private final LabelDao labelDao;

    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);

    public LabelRepository(Application application) {
        labelApi = RetrofitClient.getClient().create(LabelApi.class);
        labelDao = AppDatabase.getInstance(application).labelDao();
    }

    public LiveData<List<Label>> getAllLabels(String userId) {
        return labelDao.getAllLabels(userId);
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public void fetchLabels(String token, String userId) {
        isLoading.postValue(true);
        labelApi.getLabels("Bearer " + token).enqueue(new Callback<List<Label>>() {
            @Override
            public void onResponse(Call<List<Label>> call, Response<List<Label>> response) {
                isLoading.postValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        labelDao.insertAll(response.body());
                    });
                } else {
                    errorMessage.postValue("Failed to fetch labels: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<List<Label>> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void addLabel(String token, Label label) {
        labelApi.addLabel("Bearer " + token, label).enqueue(new Callback<Label>() {
            @Override
            public void onResponse(Call<Label> call, Response<Label> response) {
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        labelDao.insert(response.body());
                    });
                } else {
                    errorMessage.postValue("Failed to add label: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Label> call, Throwable t) {
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void updateLabel(String token, Label label) {
        Map<String, String> nameMap = new HashMap<>();
        nameMap.put("name", label.getName()); // נשלח רק את השם החדש לפי דרישת השרת

        labelApi.updateLabel("Bearer " + token, label.getId(), nameMap).enqueue(new Callback<Label>() {
            @Override
            public void onResponse(Call<Label> call, Response<Label> response) {
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        labelDao.update(response.body()); // עדכון ברום
                    });
                } else {
                    errorMessage.postValue("Failed to update label: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Label> call, Throwable t) {
                errorMessage.postValue(t.getMessage());
            }
        });
    }



    public void deleteLabel(String token, String labelId) {
        labelApi.deleteLabel("Bearer " + token, labelId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        labelDao.deleteById(labelId);
                    });
                } else {
                    errorMessage.postValue("Failed to delete label: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                errorMessage.postValue(t.getMessage());
            }
        });
    }
}
