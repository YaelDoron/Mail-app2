package com.example.android_app.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.android_app.entity.Label;

import java.util.List;

@Dao
public interface LabelDao {

    // שליפת כל התוויות של המשתמש
    @Query("SELECT * FROM labels WHERE owner = :userId ORDER BY name ASC")
    LiveData<List<Label>> getAllLabels(String userId);

    // שליפה לפי מזהה
    @Query("SELECT * FROM labels WHERE id = :labelId AND owner = :userId LIMIT 1")
    LiveData<Label> getLabelById(String labelId, String userId);

    // הכנסת תווית בודדת
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Label label);

    // הכנסת רשימת תוויות
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Label> labels);

    // עדכון תווית
    @Update
    void update(Label label);

    // מחיקת תווית לפי מזהה
    @Query("DELETE FROM labels WHERE id = :labelId")
    void deleteById(String labelId);

    // ניקוי כל הטבלה (אם תשתמשי בזה בסנכרון)
    @Query("DELETE FROM labels")
    void clear();
}
