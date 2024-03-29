package com.adsmanagement.notifications;

import com.adsmanagement.reports.dto.ReportDto;
import com.adsmanagement.reports.models.Report;
import com.adsmanagement.reports.models.ReportState;
import com.adsmanagement.users.dto.UserDTO;
import com.adsmanagement.users.models.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NotificationDto {
    private Short id;

    private UserDTO user;

    private Boolean isSeen;

    private Date createdAt;

    private Date updatedAt;

    private String userAddress;

    private String content;

    private NotificationType type;

    private Float latitude;

    private Float longitude;
}
