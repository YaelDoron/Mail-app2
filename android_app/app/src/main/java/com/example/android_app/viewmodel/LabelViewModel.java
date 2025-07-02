package com.example.android_app.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.android_app.MyApplication;
import com.example.android_app.entity.Label;
import com.example.android_app.repository.LabelRepository;

import java.util.List;

public class LabelViewModel extends ViewModel {

    private final LabelRepository labelRepository;

    public LabelViewModel() {
        labelRepository = MyApplication.getInstance().getLabelRepository();
    }

    public LiveData<List<Label>> getAllLabels(String userId) {
        return labelRepository.getAllLabels(userId);
    }

    public LiveData<String> getErrorMessage() {
        return labelRepository.getErrorMessage();
    }

    public LiveData<Boolean> getIsLoading() {
        return labelRepository.getIsLoading();
    }

    public void fetchLabels(String token, String userId) {
        labelRepository.fetchLabels(token, userId);
    }

    public void addLabel(String token, Label label) {
        labelRepository.addLabel(token, label);
    }

    public void updateLabel(String token, Label label) {
        labelRepository.updateLabel(token, label);
    }

    public void deleteLabel(String token, String labelId) {
        labelRepository.deleteLabel(token, labelId);
    }
}
