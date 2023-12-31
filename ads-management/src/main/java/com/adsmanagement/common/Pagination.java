package com.adsmanagement.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Pagination {
    private Short size;
    private Short page;
    private Short totalPage;

}
