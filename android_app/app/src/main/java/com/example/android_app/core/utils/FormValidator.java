package com.example.android_app.core.utils;

import android.util.Patterns;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class FormValidator {
    public static boolean isEmailValid(String email) {
        return email != null &&
                email.contains("@") &&
                email.indexOf("@") == email.lastIndexOf("@") &&
                email.endsWith("@mailsnap.com");
    }

    public static boolean isPasswordValid(String password) {
        return password != null && password.length() >= 8;
    }

    public static boolean doPasswordsMatch(String password, String confirmPassword) {
        return password != null && password.equals(confirmPassword);
    }

    public static boolean isNameValid(String name) {
        return name != null && name.trim().length() >= 2;
    }

    public static boolean isGenderValid(String gender) {
        return gender != null && (gender.equals("Male") || gender.equals("Female"));
    }

    public static boolean isDateValid(String birthDate) {
        if (birthDate == null || birthDate.isEmpty()) return false;

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setLenient(false);

        try {
            Date date = sdf.parse(birthDate);
            Calendar dob = Calendar.getInstance();
            dob.setTime(date);

            Calendar today = Calendar.getInstance();
            int age = today.get(Calendar.YEAR) - dob.get(Calendar.YEAR);

            if (today.get(Calendar.DAY_OF_YEAR) < dob.get(Calendar.DAY_OF_YEAR)) {
                age--;
            }

            return age >= 13;
        } catch (ParseException e) {
            return false;
        }
    }
}