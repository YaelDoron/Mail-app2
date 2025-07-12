package com.example.android_app.ui;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.example.android_app.R;
import com.example.android_app.core.MyApplication;
import com.example.android_app.entity.Label;
import com.example.android_app.viewmodel.LabelViewModel;
import com.example.android_app.viewmodel.MailViewModel;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MailInfoActivity extends AppCompatActivity {
    private String mailId;
    private MailViewModel mailViewModel;
    private LabelViewModel labelViewModel;
    private List<Label> currentLabels = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mail_info);

        mailViewModel = MyApplication.getInstance().getMailViewModel();
        labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);

        ImageView backButton = findViewById(R.id.backButton);
        ImageView reportButton = findViewById(R.id.reportButton);
        ImageView deleteButton = findViewById(R.id.deleteButton);
        ImageView labelButton = findViewById(R.id.labelButton);
        ImageView restoreButton = findViewById(R.id.restoreButton);

        TextView subjectView = findViewById(R.id.mailSubject);
        TextView fromView = findViewById(R.id.mailFrom);
        TextView timeView = findViewById(R.id.mailTime);
        TextView bodyView = findViewById(R.id.mailBody);
        ImageView profileIcon = findViewById(R.id.profileIcon);

        String subject = getIntent().getStringExtra("subject");
        String from = getIntent().getStringExtra("from");
        String time = getIntent().getStringExtra("time");
        String body = getIntent().getStringExtra("body");
        mailId = getIntent().getStringExtra("id");
        String senderImage = getIntent().getStringExtra("senderImage");
        boolean isTrash = getIntent().getBooleanExtra("isTrash", false);

        subjectView.setText(subject);
        fromView.setText(from);
        timeView.setText(time);
        bodyView.setText(body);

        if (senderImage != null && !senderImage.isEmpty()) {
            String fullImageUrl = "http://10.0.2.2:3000/" + senderImage.replace("\\", "/").replace(" ", "%20");
            Glide.with(this)
                    .load(fullImageUrl)
                    .placeholder(R.drawable.ic_avatar_placeholder)
                    .error(R.drawable.ic_avatar_placeholder)
                    .circleCrop()
                    .into(profileIcon);
        } else {
            profileIcon.setImageResource(R.drawable.ic_avatar_placeholder);
        }

        backButton.setOnClickListener(v -> finish());

        reportButton.setOnClickListener(v -> {
            if (mailId != null) mailViewModel.toggleSpam(mailId);
        });

        deleteButton.setOnClickListener(v -> {
            if (mailId != null) {
                mailViewModel.deleteMail(mailId);
                finish();
            }
        });

        restoreButton.setOnClickListener(v -> {
            if (mailId != null) {
                mailViewModel.restoreMail(mailId);
                finish();
            }
        });

        if (isTrash) {
            deleteButton.setVisibility(View.GONE);
            restoreButton.setVisibility(View.VISIBLE);
        } else {
            deleteButton.setVisibility(View.VISIBLE);
            restoreButton.setVisibility(View.GONE);
        }

        labelButton.setOnClickListener(v -> showLabelPopupMenu(labelButton));

        mailViewModel.getCurrentUser().observe(this, user -> {
            if (user != null && user.getToken() != null) {
                labelViewModel.setCurrentUser(user);
                labelViewModel.getLabels().observe(this, labels -> {
                    currentLabels = labels;
                });
                labelViewModel.fetchLabels();
            }
        });

        mailViewModel.getMails().observe(this, mails -> {
            if (mails != null && !mails.isEmpty() && mailId != null) {
                mailViewModel.markAsRead(mailId);
            }
        });

        mailViewModel.getErrorMessage().observe(this, msg -> {
            if (msg != null) Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
        });
    }

    private void showLabelPopupMenu(ImageView anchor) {
        if (mailId == null) {
            return;
        }

        if (currentLabels == null || currentLabels.isEmpty()) {
            return;
        }

        PopupMenu popupMenu = new PopupMenu(this, anchor);
        for (Label label : currentLabels) {
            popupMenu.getMenu().add(label.getName()).setOnMenuItemClickListener(item -> {
                Map<String, List<String>> labelMap = new HashMap<>();
                labelMap.put("labels", Collections.singletonList(label.getId()));
                mailViewModel.assignLabels(mailId, labelMap);

                return true;
            });
        }
        popupMenu.show();
    }
}
