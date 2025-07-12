package com.example.android_app.core;

import android.app.Application;
import android.content.Context;

import androidx.lifecycle.ViewModel;

import com.example.android_app.repository.LabelRepository;
import com.example.android_app.repository.MailRepository;
import com.example.android_app.viewmodel.LabelViewModel;
import com.example.android_app.viewmodel.MailViewModel;
import com.example.android_app.viewmodel.UserViewModel;

public class MyApplication extends Application {
    private static String token;
    private static MyApplication instance;

    private MailViewModel mailViewModel;
    private UserViewModel userViewModel;
    private LabelViewModel labelViewModel;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;

        mailViewModel = new MailViewModel(this);
        userViewModel = new UserViewModel(this);
        labelViewModel = new LabelViewModel(this);
    }

    public static MyApplication getInstance() {
        return instance;
    }

    public static void setToken(String t) {
        token = t;
    }

    public static String getToken() {
        return token;
    }
    public UserViewModel getUserViewModel() {return userViewModel;}
    public MailViewModel getMailViewModel() {return mailViewModel;};
    public LabelViewModel getLabelViewModel() {return labelViewModel;}
}
