package com.example.android_app;

import android.app.Application;
import android.content.Context;
import com.example.android_app.repository.MailRepository;
import com.example.android_app.AppDatabase;

public class MyApplication extends Application {
    private static MyApplication instance;
    private static String token;
    private MailRepository mailRepository;


    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        AppDatabase db = AppDatabase.getInstance(this);
        mailRepository = new MailRepository(this);
    }

    public static MyApplication getInstance() {
        return instance;
    }
    public static Context getAppContext() {
        return instance.getApplicationContext();
    }

    public static void setToken(String t) {
        token = t;
    }

    public static String getToken() {
        return token;
    }

    public MailRepository getMailRepository() {
        return mailRepository;
    }

}
