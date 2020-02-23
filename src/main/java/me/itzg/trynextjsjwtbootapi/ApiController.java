package me.itzg.trynextjsjwtbootapi;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class ApiController {

  @GetMapping("/greeting")
  public Mono<Greeting> getGreeting(@AuthenticationPrincipal Jwt principal) {
    return Mono.just(
        new Greeting()
        .setMessage("Hello, "+principal.getClaim("name"))
    );
  }
}
