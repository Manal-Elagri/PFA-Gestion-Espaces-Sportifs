package com.example.pfa.config;

import com.example.pfa.entities.CompteResponsable;
import com.example.pfa.services.CompteResponsableService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class CustomAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(CustomAuthFilter.class);
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Liste des chemins qui ne nécessitent pas d'authentification
    private final List<String> publicPaths = Arrays.asList(
            "/api/compte-responsable/login",
            "/api/compte-responsable/register",
            "/public/**",
            "/static/**"
    );

    @Autowired
    private CompteResponsableService compteResponsableService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Ne pas filtrer les requêtes OPTIONS (pré-vol CORS)
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        // Ne pas filtrer les chemins publics
        String path = request.getRequestURI();
        boolean isPublicPath = publicPaths.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));

        return isPublicPath;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        logger.debug("Filtering request to: {}", path);

        try {
            // Vérification du token d'authentification
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                String tokenValue = token.substring(7);
                logger.debug("Token trouvé, tentative d'authentification");

                CompteResponsable responsable = compteResponsableService.findByToken(tokenValue);
                if (responsable != null) {
                    UserDetails userDetails = new User(responsable.getEmail(), responsable.getPassword(), new ArrayList<>());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Authentification réussie pour: {}", responsable.getEmail());
                } else {
                    logger.warn("Token invalide, authentification échouée");
                }
            } else {
                logger.debug("Aucun token Bearer trouvé dans la requête");
            }
        } catch (Exception e) {
            logger.error("Erreur dans le processus d'authentification", e);
            // Ne pas propager l'exception pour éviter de bloquer la chaîne de filtres
        }

        filterChain.doFilter(request, response);
    }
}