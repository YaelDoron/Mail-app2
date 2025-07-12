package com.example.android_app.repository;

import android.app.Application;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_app.api.MailApi;
import com.example.android_app.api.RetrofitClient;
import com.example.android_app.core.AppDatabase;
import com.example.android_app.dao.MailDao;
import com.example.android_app.dao.UserDao;
import com.example.android_app.entity.Mail;
import com.example.android_app.entity.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MailRepository {
    private static MailRepository instance;

    private final MailDao mailDao;
    private final UserDao userDao;
    private final MailApi mailApi;

    private final MutableLiveData<Mail> selectedMail = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final MutableLiveData<List<Mail>> searchResults = new MutableLiveData<>();
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);

    public MailRepository(Application application) {
        AppDatabase db = AppDatabase.getInstance(application);
        mailApi = RetrofitClient.getClient().create(MailApi.class);
        mailDao = db.mailDao();
        userDao = db.userDao();
    }

    public LiveData<User> getCurrentUser() {
        return userDao.getUser();
    }
    public LiveData<List<Mail>> getInboxMails(String userId) { return mailDao.getInbox(userId); }
    public LiveData<List<Mail>> getSentMails(String userId) { return mailDao.getSent(userId); }
    public LiveData<List<Mail>> getDraftMails(String userId) { return mailDao.getDrafts(userId); }
    public LiveData<List<Mail>> getSpamMails(String userId) { return mailDao.getSpam(userId); }
    public LiveData<List<Mail>> getStarredMails(String userId) { return mailDao.getStarred(userId); }
    public LiveData<List<Mail>> getTrashMails(String userId) { return mailDao.getTrash(userId); }
    public LiveData<List<Mail>> getLabelMails(String userId, String label) { return mailDao.getByLabel(userId, label); }
    public LiveData<List<Mail>> getSearchResults() { return searchResults; }
    public LiveData<Mail> getSelectedMail() { return selectedMail; }
    public LiveData<String> getErrorMessage() { return errorMessage; }
    public LiveData<Boolean> getIsLoading() { return isLoading; }

    public static synchronized MailRepository getInstance(Application application) {
        if (instance == null) {
            instance = new MailRepository(application);
        }
        return instance;
    }

    public void fetchMailsByLabel(String labelId, MailListCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) {
                errorMessage.postValue("User not logged in");
                return;
            }

            Map<String, String> body = new HashMap<>();
            body.put("labelId", labelId);

            mailApi.getMailsByLabel("Bearer " + user.getToken(), body).enqueue(new Callback<List<Mail>>() {
                @Override
                public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        List<Mail> mails = response.body();

                        Executors.newSingleThreadExecutor().execute(() -> {
                            mailDao.insertAll(mails);
                        });

                        callback.onSuccess(mails);
                    } else {
                        callback.onError("Error: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<List<Mail>> call, Throwable t) {
                    callback.onError(t.getMessage());
                }
            });
        });
    }

    public void fetchMails(String type, MailListCallback callback) {
        isLoading.postValue(true);

        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) {
                isLoading.postValue(false);
                errorMessage.postValue("User not logged in");
                return;
            }

            String token = "Bearer " + user.getToken();
            Call<List<Mail>> call;

            switch (type) {
                case "inbox":
                    call = mailApi.getInboxMails(token); break;
                case "sent":
                    call = mailApi.getSentMails(token); break;
                case "draft":
                    call = mailApi.getDraftMails(token); break;
                case "spam":
                    call = mailApi.getSpamMails(token); break;
                case "starred":
                    call = mailApi.getStarredMails(token); break;
                case "trash":
                    call = mailApi.getTrashMails(token); break;
                default:
                    call = mailApi.getInboxMails(token); break;
            }

            call.enqueue(new Callback<List<Mail>>() {
                @Override
                public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                    isLoading.postValue(false);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Mail> mails = response.body();

                        Executors.newSingleThreadExecutor().execute(() -> {
                            mailDao.insertAll(mails);
                        });

                        callback.onSuccess(mails);
                    } else {
                        callback.onError("Error: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<List<Mail>> call, Throwable t) {
                    isLoading.postValue(false);
                    callback.onError(t.getMessage());
                }
            });
        });
    }

    public void searchMails(String query, MailListCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) {
                callback.onError("User not logged in");
                return;
            }
            mailApi.searchMails("Bearer " + user.getToken(), query).enqueue(new Callback<List<Mail>>() {
                @Override
                public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        callback.onSuccess(response.body());
                    } else {
                        callback.onError("Search failed");
                    }
                }

                @Override
                public void onFailure(Call<List<Mail>> call, Throwable t) {
                    callback.onError(t.getMessage());
                }
            });
        });
    }

    public void fetchMailById(String mailId, SingleMailCallback callback) {
        isLoading.postValue(true);
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) {
                isLoading.postValue(false);
                errorMessage.postValue("User not logged in");
                return;
            }
            mailApi.getMailById("Bearer " + user.getToken(), mailId).enqueue(new Callback<Mail>() {
                @Override public void onResponse(Call<Mail> call, Response<Mail> response) {
                    isLoading.postValue(false);
                    if (response.isSuccessful() && response.body() != null)
                        callback.onSuccess(response.body());
                    else callback.onError("Error fetching mail");
                }
                @Override public void onFailure(Call<Mail> call, Throwable t) {
                    isLoading.postValue(false);
                    callback.onError(t.getMessage());
                }
            });
        });
    }

    public void markAsRead(String mailId) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.markAsRead("Bearer " + user.getToken(), mailId).enqueue(new Callback<Void>() {
                @Override public void onResponse(Call<Void> call, Response<Void> response) {}
                @Override public void onFailure(Call<Void> call, Throwable t) {}
            });
        });
    }

    public void toggleStarred(String mailId, MailUpdateCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.toggleStarred("Bearer " + user.getToken(), mailId).enqueue(new Callback<Mail>() {
                @Override public void onResponse(Call<Mail> call, Response<Mail> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        callback.onUpdated(response.body());
                    }
                }

                @Override public void onFailure(Call<Mail> call, Throwable t) {}
            });
        });
    }

    public void toggleSpam(String mailId) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.toggleSpam("Bearer " + user.getToken(), mailId).enqueue(new Callback<Mail>() {
                @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
                @Override public void onFailure(Call<Mail> call, Throwable t) {}
            });
        });
    }

    public void assignLabels(String mailId, Map<String, List<String>> labels) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.assignLabels("Bearer " + user.getToken(), mailId, labels).enqueue(new Callback<Mail>() {
                @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
                @Override public void onFailure(Call<Mail> call, Throwable t) {}
            });
        });
    }

    public void unassignLabel(String mailId, Map<String, String> label) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.unassignLabel("Bearer " + user.getToken(), mailId, label).enqueue(new Callback<Mail>() {
                @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
                @Override public void onFailure(Call<Mail> call, Throwable t) {}
            });
        });
    }

    public void createMail(Mail mail) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.createMail("Bearer " + user.getToken(), mail).enqueue(new Callback<Mail>() {
                @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
                @Override public void onFailure(Call<Mail> call, Throwable t) {}
            });
        });
    }

    public void updateDraft(String mailId, Mail updates) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.updateDraft("Bearer " + user.getToken(), mailId, updates).enqueue(new Callback<Mail>() {
                @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
                @Override public void onFailure(Call<Mail> call, Throwable t) {}
            });
        });
    }

    public void sendDraft(String mailId) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.sendDraft("Bearer " + user.getToken(), mailId).enqueue(new Callback<Void>() {
                @Override public void onResponse(Call<Void> call, Response<Void> response) {}
                @Override public void onFailure(Call<Void> call, Throwable t) {}
            });
        });
    }

    public void deleteMail(String mailId, Runnable onSuccess) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.deleteMail("Bearer " + user.getToken(), mailId).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.isSuccessful()) {
                        onSuccess.run();
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    // optional: handle error
                }
            });
        });
    }

    public void restoreMail(String mailId) {
        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUserSync();
            if (user == null || user.getToken() == null) return;
            mailApi.restoreMail("Bearer " + user.getToken(), mailId).enqueue(new Callback<Void>() {
                @Override public void onResponse(Call<Void> call, Response<Void> response) {}
                @Override public void onFailure(Call<Void> call, Throwable t) {}
            });
        });
    }

    public interface MailListCallback {
        void onSuccess(List<Mail> mails);
        void onError(String error);
    }

    public interface SingleMailCallback {
        void onSuccess(Mail mail);
        void onError(String error);
    }

    public interface MailUpdateCallback {
        void onUpdated(Mail updatedMail);
    }
}