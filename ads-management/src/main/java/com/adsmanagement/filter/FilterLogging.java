package com.adsmanagement.filter;

import com.adsmanagement.spaces.SpaceService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

@Component
public class FilterLogging extends OncePerRequestFilter {
    private static final Logger logSpaces = LoggerFactory.getLogger(SpaceService.class);


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        ContentCachingRequestWrapper cachingRequestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper cachingResponseWrapper = new ContentCachingResponseWrapper(response);

        filterChain.doFilter(cachingRequestWrapper, cachingResponseWrapper);

        String requestBody = getValueAsString(cachingRequestWrapper.getContentAsByteArray(),cachingRequestWrapper.getCharacterEncoding());
        String responseBody = getValueAsString(cachingResponseWrapper.getContentAsByteArray(),cachingResponseWrapper.getCharacterEncoding());

        if(request.getRequestURI().startsWith("/api/")){
            if(request.getRequestURI().startsWith("/api/v1/spaces")){
                logSpaces.info("Filter: METHOD = {}; REQUEST URI = {}; REQUEST BODY = {}; RESPONSE CODE = {}; RESPONSE BODY = {}",
                        request.getMethod(), request.getRequestURI(), requestBody, response.getStatus(), responseBody);
            }
        }

        cachingResponseWrapper.copyBodyToResponse();
    }

    private String getValueAsString(byte[] contentAsByteArray, String characterEncoding) {
        String dataAsString = "";
        try {
            dataAsString = new String(contentAsByteArray, characterEncoding).replaceAll("\\s", "");
        }catch (Exception e) {
            e.printStackTrace();
        }
        return dataAsString;
    }

}
