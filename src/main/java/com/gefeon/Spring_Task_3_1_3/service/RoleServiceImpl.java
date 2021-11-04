package com.gefeon.Spring_Task_3_1_3.service;

import com.gefeon.Spring_Task_3_1_3.dao.RoleDao;
import com.gefeon.Spring_Task_3_1_3.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    private RoleDao roleDao;

    @Autowired
    public void setRoleDao(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Override
    @Transactional
    public void addRole(Role role) {
        roleDao.addRole(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> listRoles() {
        return roleDao.listRoles();
    }

    @Override
    @Transactional(readOnly = true)
    public Role getRole(String name) {
        return roleDao.getRole(name);
    }
}
