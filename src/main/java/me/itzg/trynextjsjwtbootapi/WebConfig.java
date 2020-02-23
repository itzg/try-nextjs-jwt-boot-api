package me.itzg.trynextjsjwtbootapi;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity.CorsSpec;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import reactor.core.publisher.Mono;

@Configuration
public class WebConfig  {

  /**
   * This is needed so that {@link CorsSpec#getCorsFilter()} will pick up the CORS config and
   * create a preflight filter.
   * @return
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration corsConfig = new CorsConfiguration();
    corsConfig.addAllowedOrigin(CorsConfiguration.ALL);
    corsConfig.addAllowedMethod(CorsConfiguration.ALL);
    corsConfig.addAllowedHeader("Authorization");

    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", corsConfig);

    return source;
  }

  @Bean
  public ReactiveUserDetailsService userDetailsService() {
    // users are loaded externally via OAuth2/JKS ID Token, so stub out the user details service
    return s -> Mono.empty();
  }
}
