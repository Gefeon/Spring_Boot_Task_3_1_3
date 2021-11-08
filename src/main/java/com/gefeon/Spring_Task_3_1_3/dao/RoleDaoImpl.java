package com.gefeon.Spring_Task_3_1_3.dao;

import com.gefeon.Spring_Task_3_1_3.model.Role;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class RoleDaoImpl implements RoleDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void addRole(Role role) {
        entityManager.persist(role);
    }

    @Override
    public List<Role> listRoles() {
        return entityManager.createQuery("select r from Role r", Role.class).getResultList();
    }

    @Override
    public Role getRole(String name) {
        return entityManager.createQuery("select r from Role r where r.name=:role",
                Role.class).setParameter("role", name).getSingleResult();
    }
}
