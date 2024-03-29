package com.adsmanagement.surfaceAllowance.dto;

import com.adsmanagement.spaces.models.RequestState;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProcessResponse {
    private RequestState state;
    private String response;
}
