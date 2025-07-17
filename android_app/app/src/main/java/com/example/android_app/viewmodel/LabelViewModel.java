package com.example.android_app.viewmodel;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_app.entity.Label;
import com.example.android_app.entity.User;
import com.example.android_app.repository.LabelRepository;

import java.util.ArrayList;
import java.util.List;

public class LabelViewModel extends AndroidViewModel {
    private LiveData<List<Label>> currentSource;
    private final LabelRepository labelRepository;
    private final MediatorLiveData<List<Label>> labelLiveData = new MediatorLiveData<>();

    public LabelViewModel(@NonNull Application application) {
        super(application);
        labelRepository = LabelRepository.getInstance(application);
    }

    public void setCurrentUser(User user) {
        if (user == null || user.getId() == null) return;

        if (currentSource != null) {
            labelLiveData.removeSource(currentSource);
        }

        currentSource = labelRepository.getLabelLiveData(user.getId());
        labelLiveData.addSource(currentSource, labelLiveData::setValue);
    }

    public LiveData<List<Label>> getLabels() {
        return labelLiveData;
    }

    public void fetchLabels() {
        labelRepository.fetchLabels(new LabelRepository.FetchLabelsCallback() {
            @Override
            public void onLabelsFetched(List<Label> labels) {
                labelLiveData.postValue(labels);  // Force emit!
            }

            @Override
            public void onError(String errorMsg) {
                Log.e("LabelViewModel", "Fetch error: " + errorMsg);
            }
        });

    }

    public void updateLabel(Label label) {
        labelRepository.updateLabel(label, () -> fetchLabels());
    }

    public void addLabel(Label label) {
        labelRepository.addLabel(label, addedLabel -> fetchLabels());
    }

    public void deleteLabel(String labelId) {
        labelRepository.deleteLabel(labelId);
        fetchLabels();
    }
}
