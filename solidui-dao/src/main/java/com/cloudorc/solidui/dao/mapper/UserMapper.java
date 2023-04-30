package com.cloudorc.solidui.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudorc.solidui.dao.entity.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

@CacheConfig(cacheNames = "user", keyGenerator = "cacheKeyGenerator")
public interface UserMapper extends BaseMapper<User> {

    /**
     * select by user id
     */
    @Cacheable(sync = true)
    User selectById(int id);

    /**
     * delete by id
     */
    @CacheEvict
    int deleteById(int id);

    /**
     * update
     */
    @CacheEvict(key = "#p0.id")
    int updateById(@Param("et") User user);

    /**
     * query all general user
     *
     * @return user list
     */
    List<User> queryAllGeneralUser();

    /**
     * query user by name
     *
     * @param userName userName
     * @return user
     */
    User queryByUserNameAccurately(@Param("userName") String userName);

    /**
     * query user by userName and password
     *
     * @param userName userName
     * @param password password
     * @return user
     */
    User queryUserByNamePassword(@Param("userName") String userName, @Param("password") String password);
}
