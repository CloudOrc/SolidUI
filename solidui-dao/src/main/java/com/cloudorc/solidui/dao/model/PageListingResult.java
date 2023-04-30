package com.cloudorc.solidui.dao.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PageListingResult<T> {

    private List<T> records;

    private long totalCount;

    private int currentPage;

    private int pageSize;

}
