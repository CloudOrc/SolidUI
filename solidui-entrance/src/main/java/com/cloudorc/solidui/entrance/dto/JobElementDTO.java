package com.cloudorc.solidui.entrance.dto;



import com.cloudorc.solidui.entrance.vo.JobElementPageVO;

import java.util.Date;
@lombok.Data
public class JobElementDTO {

    private Long id;

    private Long projectId;

    private String name;
    /**
     * data type
     * legend type
     */
    private String dataType;

    private Date createTime;

    private Date updateTime;

    private DataView dataView;

    public JobElementDTO() {
    }
    @lombok.Data
    public static class DataView {
        private JobElementPageVO.View.Position position;
        private JobElementPageVO.Size size;
        private String options;
        private JobElementPageVO.View.Data data;

    }
}

