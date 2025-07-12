package com.example.android_app.viewmodel;

import android.app.Application;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.android_app.core.MyApplication;
import com.example.android_app.api.RetrofitClient;
import com.example.android_app.api.UserApi;
import com.example.android_app.entity.Mail;
import com.example.android_app.entity.User;
import com.example.android_app.repository.MailRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MailViewModel extends AndroidViewModel {
    private User currentUser;
    private final MailRepository mailRepository;

    private final MutableLiveData<Mail> selectedMail = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final MutableLiveData<List<Mail>> mailsLiveData = new MutableLiveData<>();
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);

    public void fetchMailsByLabel(String labelId) {
        mailRepository.fetchMailsByLabel(labelId, createListCallback());
    }

    private final Map<String, User> senderCache = new HashMap<>();

    public User getSender(String userId) {
        return senderCache.get(userId);
    }

    public void fetchSender(String userId, Runnable onComplete) {
        if (senderCache.containsKey(userId)) {
            onComplete.run();
            return;
        }
        UserApi api = RetrofitClient.getClient().create(UserApi.class);
        api.getUserById(userId).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    senderCache.put(userId, response.body());
                }
                onComplete.run();
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                onComplete.run();
            }
        });
    }


    public LiveData<User> getCurrentUser() {
        return mailRepository.getCurrentUser();
    }

    public MailViewModel(Application application) {
        super(application);
        mailRepository = MailRepository.getInstance(application);
    }

    public void setUser(User user) {
        this.currentUser = user;
    }

    public LiveData<List<Mail>> getMails() {
        return mailsLiveData;
    }

    public LiveData<Mail> getSelectedMail() {
        return selectedMail;
    }

    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public void fetchMails(String type) {
        isLoading.setValue(true);
        mailRepository.fetchMails(type, new MailRepository.MailListCallback() {
            @Override
            public void onSuccess(List<Mail> mails) {
                isLoading.setValue(false);
                mailsLiveData.setValue(mails);
            }

            @Override
            public void onError(String error) {
                isLoading.setValue(false);
                errorMessage.setValue(error);
            }
        });
    }

    public void fetchMailById(String mailId) {
        isLoading.setValue(true);
        mailRepository.fetchMailById(mailId, new MailRepository.SingleMailCallback() {
            @Override
            public void onSuccess(Mail mail) {
                isLoading.postValue(false);
                selectedMail.postValue(mail);
            }

            @Override
            public void onError(String error) {
                isLoading.postValue(false);
                errorMessage.postValue(error);
            }
        });
    }

    public void searchMails(String query) {
        isLoading.setValue(true);
        mailRepository.searchMails(query, new MailRepository.MailListCallback() {
            @Override
            public void onSuccess(List<Mail> mails) {
                isLoading.postValue(false);
                mailsLiveData.postValue(mails);
            }

            @Override
            public void onError(String error) {
                isLoading.postValue(false);
                errorMessage.postValue(error);
            }
        });
    }


    private MailRepository.MailListCallback createListCallback() {
        return new MailRepository.MailListCallback() {
            @Override
            public void onSuccess(List<Mail> mails) {
                isLoading.postValue(false);
                mailsLiveData.postValue(mails);
            }

            @Override
            public void onError(String error) {
                isLoading.postValue(false);
                errorMessage.postValue(error);
            }
        };
    }

    public void markAsRead(String mailId) {
        List<Mail> currentList = mailsLiveData.getValue();
        if (currentList == null) return;

        for (Mail mail : currentList) {
            if (mail.getId().equals(mailId)) {
                mail.setRead(true);
                break;
            }
        }
        mailsLiveData.postValue(currentList);

        mailRepository.markAsRead(mailId);
    }



    public void toggleStarred(String mailId) {
        mailRepository.toggleStarred(mailId, updatedMail -> {
            List<Mail> currentList = mailsLiveData.getValue();
            if (currentList == null) return;

            for (int i = 0; i < currentList.size(); i++) {
                if (currentList.get(i).getId().equals(updatedMail.getId())) {
                    currentList.set(i, updatedMail);
                    break;
                }
            }

            mailsLiveData.postValue(new ArrayList<>(currentList));
        });
    }


    public void toggleSpam(String mailId) {
        mailRepository.toggleSpam(mailId);
    }

    public void clearSenders() {
        senderCache.clear();
    }

    public void assignLabels(String mailId, Map<String, List<String>> labels) {
        mailRepository.assignLabels(mailId, labels);
    }

    public void unassignLabel(String mailId, Map<String, String> label) {
        mailRepository.unassignLabel(mailId, label);
    }

    public void createMail(Mail mail) {
        mailRepository.createMail(mail);
    }

    public void updateDraft(String mailId, Mail updates) {
        mailRepository.updateDraft(mailId, updates);
    }

    public void sendDraft(String mailId) {
        mailRepository.sendDraft(mailId);
    }

    public void deleteMail(String mailId) {
        mailRepository.deleteMail(mailId, () -> {
            List<Mail> currentList = mailsLiveData.getValue();
            if (currentList != null) {
                List<Mail> updatedList = new ArrayList<>(currentList);
                updatedList.removeIf(mail -> mail.getId().equals(mailId));
                mailsLiveData.postValue(updatedList);
            }
        });
    }

    public void restoreMail(String mailId) {
        mailRepository.restoreMail(mailId);
    }
}