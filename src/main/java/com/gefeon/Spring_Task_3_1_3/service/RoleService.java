package com.gefeon.Spring_Task_3_1_3.service;

import com.gefeon.Spring_Task_3_1_3.model.Role;

import java.util.List;

public interface RoleService {

    void addRole(Role role);

    List<Role> listRoles();

    Role getRole(String name);
}