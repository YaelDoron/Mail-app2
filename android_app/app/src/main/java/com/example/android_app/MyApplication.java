package com.example.android_app;

import android.app.Application;
import android.content.Context;

public class MyApplication extends Application {

    private static MyApplication instance;
    private static String token;


    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
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


}
