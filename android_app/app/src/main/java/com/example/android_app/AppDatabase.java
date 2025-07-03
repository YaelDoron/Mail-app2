package com.example.android_app;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.example.android_app.Converters;
import com.example.android_app.dao.LabelDao;
import com.example.android_app.dao.MailDao;
import com.example.android_app.dao.UserDao;
import com.example.android_app.entity.Label;
import com.example.android_app.entity.Mail;
import com.example.android_app.entity.User;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Database(entities = {Mail.class, Label.class, User.class}, version = 1, exportSchema = false)
@TypeConverters({Converters.class})
public abstract class AppDatabase extends RoomDatabase {

    // DAO methods
    public abstract MailDao mailDao();
    public abstract LabelDao labelDao();
    public abstract UserDao userDao();

    // Singleton instance
    private static volatile AppDatabase INSTANCE;

    // Executor for background DB operations
    private static final int NUMBER_OF_THREADS = 4;
    public static final ExecutorService databaseWriteExecutor =
            Executors.newFixedThreadPool(NUMBER_OF_THREADS);

    // Singleton getter
    public static AppDatabase getInstance(final Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    AppDatabase.class, "app_database")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}
