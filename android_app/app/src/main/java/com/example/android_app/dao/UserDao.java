package com.example.android_app.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.example.android_app.entity.User;

@Dao
public interface UserDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(User user);

    @Query("SELECT * FROM users LIMIT 1")
    LiveData<User> getUser();

    @Query("DELETE FROM users")
    void clearAllUsers();

    @Query("SELECT * FROM users LIMIT 1")
    User getUserSync();
}