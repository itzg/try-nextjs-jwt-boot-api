Next.js web application that uses JWT issued by Auth0 to access authenticated Spring Boot API

## Setup

In the `src/main/app` directory create an `.env` file with the following variables populated from your Auth0 application config:

```
AUTH0_DOMAIN=...
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
BASE_URL=http://localhost:3000
AUTH0_COOKIE_SECRET=...
```

## Running

Start the api/backend, replace `YOURS` with your Auth0 subdomain:
```
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dauth0-subdomain=YOURS"
```

Start the frontend:
```
mvn frontend:npm@run-frontend
```

## Implementation Notes

### Solving `401 Unauthorized` during CORS preflight in Spring Webflux

The `CorsConfigurationSource` in `WebConfig` is needed to fully configure CORS support in Spring Webflux. Without it, the `fetch` initiated from the browser 

```javascript
    const res = await fetch('http://localhost:8080/api/greeting', {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });
```

will fail with this error shown in the browser console:

```
Access to fetch at 'http://localhost:8080/api/greeting' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

With the Spring property `logging.level.web=debug`, the application logs provide a clue about why the CORS preflight failed:

```
o.s.w.s.adapter.HttpWebHandlerAdapter    : [599fe63a] HTTP OPTIONS "/api/greeting"
o.s.w.s.adapter.HttpWebHandlerAdapter    : [599fe63a] Completed 401 UNAUTHORIZED
```

The reason it results in a 401 is two-fold:
- The `OPTIONS` request of the [CORS preflight](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests) purposely limits the headers included, especially the `Authorization` header. It is actually the CORS response from the server that will indicate such headers are allowed.
- So it's a catch-22 at preflight time...without the authorization header, Spring Security will fail the `OPTIONS` request to a protected path, `/api/greeting` in this case.

CORS registration via an implementation of `addCorsMappings` in `WebFluxConfigurer` doesn't seem to activate the CORS filter creation. Instead, [the `CorsWebFilter` creation within `ServerHttpSecurity.CorsSpec.getCorsFilter`](https://github.com/spring-projects/spring-security/blob/f2da2c56bef17b686450f31d7ef3fb71bcbd85a1/config/src/main/java/org/springframework/security/config/web/server/ServerHttpSecurity.java#L659) activates when a `CorsConfigurationSource` bean is present.

The following is a quick and overly permissive configuration that satisfies the filter creation. It is important to declare `Authorization` as an allowed header; otherwise, the browser will vaguely report the same CORS preflight failure since it knows the original fetch operation could not be executed without it.

```java
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
```

The Network tab of Chrome DevTools doesn't show the preflight details, so for the curious, here are the interesting bits of the CORS preflight for this particular application.

The request:
```
OPTIONS /api/greeting HTTP/1.1
Host: localhost:8080
Access-Control-Request-Method: GET
Access-Control-Request-Headers: authorization
Origin: http://localhost:3000
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-site
```

...and the response from Spring CORS processing:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: authorization
```