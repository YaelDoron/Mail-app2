package com.example.android_app.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.android_app.MyApplication;
import com.example.android_app.entity.Mail;
import com.example.android_app.repository.MailRepository;

import java.util.List;
import java.util.Map;

public class MailViewModel extends ViewModel {
    private final MailRepository mailRepository;

    public MailViewModel() {
        mailRepository = MyApplication.getInstance().getMailRepository();
    }

    public LiveData<List<Mail>> getInboxMails() {
        return mailRepository.getInboxMails();
    }

    public LiveData<List<Mail>> getSentMails() {
        return mailRepository.getSentMails();
    }

    public LiveData<List<Mail>> getDraftMails() {
        return mailRepository.getDraftMails();
    }

    public LiveData<List<Mail>> getSpamMails() {
        return mailRepository.getSpamMails();
    }

    public LiveData<List<Mail>> getStarredMails() {
        return mailRepository.getStarredMails();
    }

    public LiveData<List<Mail>> getTrashMails() {
        return mailRepository.getTrashMails();
    }

    public LiveData<List<Mail>> getLabelMails() {
        return mailRepository.getLabelMails();
    }

    public LiveData<List<Mail>> getSearchResults() {
        return mailRepository.getSearchResults();
    }

    public LiveData<Mail> getSelectedMail() {
        return mailRepository.getSelectedMail();
    }

    public LiveData<String> getErrorMessage() {
        return mailRepository.getErrorMessage();
    }

    public LiveData<Boolean> getIsLoading() {
        return mailRepository.getIsLoading();
    }

    public void fetchInboxMails(String token) {
        mailRepository.fetchInboxMails(token);
    }

    public void fetchSentMails(String token) {
        mailRepository.fetchSentMails(token);
    }

    public void fetchDraftMails(String token) {
        mailRepository.fetchDraftMails(token);
    }

    public void fetchSpamMails(String token) {
        mailRepository.fetchSpamMails(token);
    }

    public void fetchStarredMails(String token) {
        mailRepository.fetchStarredMails(token);
    }

    public void fetchTrashMails(String token) {
        mailRepository.fetchTrashMails(token);
    }

    public void fetchMailById(String token, String mailId) {
        mailRepository.fetchMailById(token, mailId);
    }

    public void fetchMailsByLabel(String token, Map<String, String> labelMap) {
        mailRepository.fetchMailsByLabel(token, labelMap);
    }

    public void searchMails(String token, String query) {
        mailRepository.searchMails(token, query);
    }

    public void markAsRead(String token, String mailId) {
        mailRepository.markAsRead(token, mailId);
    }

    public void toggleStarred(String token, String mailId) {
        mailRepository.toggleStarred(token, mailId);
    }

    public void toggleSpam(String token, String mailId) {
        mailRepository.toggleSpam(token, mailId);
    }

    public void assignLabels(String token, String mailId, Map<String, List<String>> labels) {
        mailRepository.assignLabels(token, mailId, labels);
    }

    public void unassignLabel(String token, String mailId, Map<String, String> label) {
        mailRepository.unassignLabel(token, mailId, label);
    }

    public void createMail(String token, Mail mail) {
        mailRepository.createMail(token, mail);
    }

    public void updateDraft(String token, String mailId, Mail updates) {
        mailRepository.updateDraft(token, mailId, updates);
    }

    public void sendDraft(String token, String mailId) {
        mailRepository.sendDraft(token, mailId);
    }

    public void deleteMail(String token, String mailId) {
        mailRepository.deleteMail(token, mailId);
    }

    public void restoreMail(String token, String mailId) {
        mailRepository.restoreMail(token, mailId);
    }
}
