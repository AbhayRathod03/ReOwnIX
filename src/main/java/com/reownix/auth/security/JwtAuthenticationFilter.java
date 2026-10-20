package com.reownix.auth.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.reownix.auth.service.CustomUserDetailsService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if(header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request,response);
            return;
        }

        String token = header.substring(7);

        if(jwtService.isTokenValid(token)) {

            String email = jwtService.extractUsername(token);

            CustomUserDetails userDetails =
                    (CustomUserDetails) userDetailsService.loadUserByUsername(email);

            if (!userDetails.isEnabled()) {
                throw new DisabledException("User account is disabled");
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            System.out.println("=== AUTHENTICATION DEBUG ===");
            System.out.println("authentication: " + auth);
            System.out.println("authentication.getName(): " + auth.getName());
            System.out.println("authentication.isAuthenticated(): " + auth.isAuthenticated());
            System.out.println("authentication.getAuthorities(): " + auth.getAuthorities());
            System.out.println("============================");
        }

        filterChain.doFilter(request,response);
    }
}
