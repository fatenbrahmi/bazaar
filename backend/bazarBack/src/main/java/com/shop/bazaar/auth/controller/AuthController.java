package com.shop.bazaar.auth.controller;


import com.shop.bazaar.auth.config.JWTTokenHelper;
import com.shop.bazaar.auth.dto.LoginRequest;
import com.shop.bazaar.auth.dto.RegistrationRequest;
import com.shop.bazaar.auth.dto.RegistrationResponse;
import com.shop.bazaar.auth.dto.UserToken;
import com.shop.bazaar.auth.entities.User;
import com.shop.bazaar.auth.services.RegistrationService;






import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    RegistrationService registrationService;

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    JWTTokenHelper jwtTokenHelper;





@PostMapping("/login")
public ResponseEntity<UserToken> login(@RequestBody LoginRequest loginRequest){
    try {
        // Crée un token authentifiable
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                loginRequest.getUserName(),
                loginRequest.getPassword()
        );

        // Authentifie le token
        Authentication authenticationResponse = this.authenticationManager.authenticate(authentication);

        if (authenticationResponse.isAuthenticated()) {
            User user = (User) authenticationResponse.getPrincipal();

            // Vérifie si le compte est activé
            if (!user.isEnabled()) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            // Génère le token JWT
            String token = jwtTokenHelper.generateToken(user.getUsername());
            UserToken userToken = UserToken.builder().token(token).build();
            return new ResponseEntity<>(userToken, HttpStatus.OK);
        }

    } catch (BadCredentialsException e) {
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
}




    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@RequestBody RegistrationRequest request){
        RegistrationResponse registrationResponse = registrationService.createUser(request);

        return new ResponseEntity<>(registrationResponse,
                registrationResponse.getCode() == 200 ? HttpStatus.OK: HttpStatus.BAD_REQUEST);
    }




    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String,String> map){
        String userName = map.get("userName");
        String code = map.get("code");

        User user= (User) userDetailsService.loadUserByUsername(userName);
        if(null != user && user.getVerificationCode().equals(code)){
            registrationService.verifyUser(userName);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}