package com.gefeon.Spring_Task_3_1_3.dao;

import com.gefeon.Spring_Task_3_1_3.model.Role;

import java.util.List;

public interface RoleDao {

    void addRole(Role role);

    List<Role> listRoles();

    Role getRole(String name);
}