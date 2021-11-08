package com.gefeon.Spring_Task_3_1_3.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import javax.persistence.*;
import java.util.Collection;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "username", nullable = false, unique = true, length = 60)
    @Size(min = 4, max = 60, message = "Username should be between 4 and 60 characters")
    private String username;

    @NotNull
    @Column(name = "password", nullable = false, length = 60)
    @Size(min = 4, max = 60, message = "Password should be between 4 and 60 characters")
    private String password;

    @NotNull
    @Column(name = "name", nullable = false, length = 60)
    @Size(max = 60, message = "Name should be not more than 60 characters")
    private String name;

    @NotNull
    @Column(name = "surname", nullable = false, length = 60)
    @Size(max = 60, message = "Surname should be not more than 60 characters")
    private String surname;

    @NotNull
    @Column(name = "age", nullable = false)
    private byte age;

    @NotNull
    @Column(name = "phoneNumber")
    @Size(min = 5, max = 60, message = "Phone number should be between 5 and 60 characters")
    private String phoneNumber;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "users_id"),
            inverseJoinColumns = @JoinColumn(name = "roles_id"))
    private Set<Role> roles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoles();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", age=" + age +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", roles=" + roles +
                '}';
    }
}