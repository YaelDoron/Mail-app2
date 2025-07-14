package com.example.android_app.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;
import androidx.room.Upsert;

import com.example.android_app.entity.Label;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

@Dao
public interface LabelDao {
    @Query("SELECT * FROM labels WHERE owner = :userId ORDER BY name ASC")
    LiveData<List<Label>> getAllLabels(String userId);

    @Query("SELECT * FROM labels WHERE id = :labelId AND owner = :userId LIMIT 1")
    LiveData<Label> getLabelById(String labelId, String userId);

    @Upsert
    void insert(Label label);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Label> labels);

    @Query("DELETE FROM labels WHERE id = :labelId")
    void deleteById(String labelId);

    @Query("DELETE FROM labels")
    void clear();

}