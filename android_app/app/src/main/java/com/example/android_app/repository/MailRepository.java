package com.example.android_app.repository;

import android.app.Application;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_app.api.MailApi;
import com.example.android_app.api.RetrofitClient;
import com.example.android_app.dao.MailDao;
import com.example.android_app.AppDatabase;
import com.example.android_app.entity.Mail;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MailRepository {

    private final MailApi mailApi;
    private final MailDao mailDao;

    private final MutableLiveData<List<Mail>> searchResults = new MutableLiveData<>();
    private final MutableLiveData<Mail> selectedMail = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);

    public MailRepository(Application application) {
        mailApi = RetrofitClient.getClient().create(MailApi.class);
        mailDao = AppDatabase.getInstance(application).mailDao();
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

    public void fetchInboxMails(String token, String userId) {
        isLoading.postValue(true);
        mailApi.getInboxMails("Bearer " + token).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                isLoading.postValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> mailDao.insertAll(response.body()));
                }
            }
            @Override public void onFailure(Call<List<Mail>> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void fetchSentMails(String token, String userId) {
        isLoading.postValue(true);
        mailApi.getSentMails("Bearer " + token).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                isLoading.postValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> mailDao.insertAll(response.body()));
                }
            }
            @Override public void onFailure(Call<List<Mail>> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void fetchDraftMails(String token, String userId) {
        isLoading.postValue(true);
        mailApi.getDraftMails("Bearer " + token).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                isLoading.postValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> mailDao.insertAll(response.body()));
                }
            }
            @Override public void onFailure(Call<List<Mail>> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void fetchSpamMails(String token, String userId) {
        isLoading.postValue(true);
        mailApi.getSpamMails("Bearer " + token).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                isLoading.postValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> mailDao.insertAll(response.body()));
                }
            }
            @Override public void onFailure(Call<List<Mail>> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void fetchStarredMails(String token, String userId) {
        isLoading.postValue(true);
        mailApi.getStarredMails("Bearer " + token).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                isLoading.postValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> mailDao.insertAll(response.body()));
                }
            }
            @Override public void onFailure(Call<List<Mail>> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void fetchTrashMails(String token, String userId) {
        isLoading.postValue(true);
        mailApi.getTrashMails("Bearer " + token).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                isLoading.postValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> mailDao.insertAll(response.body()));
                }
            }
            @Override public void onFailure(Call<List<Mail>> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void fetchMailById(String token, String mailId) {
        isLoading.postValue(true);
        mailApi.getMailById("Bearer " + token, mailId).enqueue(new Callback<Mail>() {
            @Override
            public void onResponse(Call<Mail> call, Response<Mail> response) {
                isLoading.postValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    selectedMail.postValue(response.body());
                }
            }
            @Override public void onFailure(Call<Mail> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void searchMails(String token, String query) {
        isLoading.postValue(true);
        mailApi.searchMails("Bearer " + token, query).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
                isLoading.postValue(false);
                if (response.isSuccessful()) searchResults.postValue(response.body());
            }
            @Override public void onFailure(Call<List<Mail>> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue(t.getMessage());
            }
        });
    }

    public void markAsRead(String token, String mailId) {
        mailApi.markAsRead("Bearer " + token, mailId).enqueue(new Callback<Void>() {
            @Override public void onResponse(Call<Void> call, Response<Void> response) {}
            @Override public void onFailure(Call<Void> call, Throwable t) {}
        });
    }

    public void toggleStarred(String token, String mailId) {
        mailApi.toggleStarred("Bearer " + token, mailId).enqueue(new Callback<Mail>() {
            @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
            @Override public void onFailure(Call<Mail> call, Throwable t) {}
        });
    }

    public void toggleSpam(String token, String mailId) {
        mailApi.toggleSpam("Bearer " + token, mailId).enqueue(new Callback<Mail>() {
            @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
            @Override public void onFailure(Call<Mail> call, Throwable t) {}
        });
    }

    public void assignLabels(String token, String mailId, Map<String, List<String>> labels) {
        mailApi.assignLabels("Bearer " + token, mailId, labels).enqueue(new Callback<Mail>() {
            @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
            @Override public void onFailure(Call<Mail> call, Throwable t) {}
        });
    }

    public void unassignLabel(String token, String mailId, Map<String, String> label) {
        mailApi.unassignLabel("Bearer " + token, mailId, label).enqueue(new Callback<Mail>() {
            @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
            @Override public void onFailure(Call<Mail> call, Throwable t) {}
        });
    }

    public void createMail(String token, Mail mail) {
        mailApi.createMail("Bearer " + token, mail).enqueue(new Callback<Mail>() {
            @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
            @Override public void onFailure(Call<Mail> call, Throwable t) {}
        });
    }

    public void updateDraft(String token, String mailId, Mail updates) {
        mailApi.updateDraft("Bearer " + token, mailId, updates).enqueue(new Callback<Mail>() {
            @Override public void onResponse(Call<Mail> call, Response<Mail> response) {}
            @Override public void onFailure(Call<Mail> call, Throwable t) {}
        });
    }

    public void sendDraft(String token, String mailId) {
        mailApi.sendDraft("Bearer " + token, mailId).enqueue(new Callback<Void>() {
            @Override public void onResponse(Call<Void> call, Response<Void> response) {}
            @Override public void onFailure(Call<Void> call, Throwable t) {}
        });
    }

    public void deleteMail(String token, String mailId) {
        mailApi.deleteMail("Bearer " + token, mailId).enqueue(new Callback<Void>() {
            @Override public void onResponse(Call<Void> call, Response<Void> response) {}
            @Override public void onFailure(Call<Void> call, Throwable t) {}
        });
    }

    public void restoreMail(String token, String mailId) {
        mailApi.restoreMail("Bearer " + token, mailId).enqueue(new Callback<Void>() {
            @Override public void onResponse(Call<Void> call, Response<Void> response) {}
            @Override public void onFailure(Call<Void> call, Throwable t) {}
        });
    }
}
