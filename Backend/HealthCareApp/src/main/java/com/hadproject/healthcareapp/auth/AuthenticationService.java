package com.hadproject.healthcareapp.auth;

import com.hadproject.healthcareapp.config.JwtService;
import com.hadproject.healthcareapp.token.Token;
import com.hadproject.healthcareapp.token.TokenRepository;
import com.hadproject.healthcareapp.token.TokenType;
import com.hadproject.healthcareapp.user.User;
import com.hadproject.healthcareapp.user.UserDetail;
import com.hadproject.healthcareapp.user.UserRepository;
import com.hadproject.healthcareapp.user.UserDetailRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthenticationService {
  private final UserRepository repository;
  private final TokenRepository tokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final UserDetailRepository userDetailRepository;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationResponse register(RegisterRequest request) {
    var user = User.builder()
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(request.getRole())
        .build();


    var savedUser = repository.save(user);
    User user_id = repository.findByEmail(request.getEmail()).orElse(user);
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    saveUserToken(savedUser, jwtToken);
    var userDetail = UserDetail.builder()
            .uid(user_id)
            .fname(request.getFname())
            .mname(request.getMname())
            .lname(request.getLname())
            .gender(request.getGender())
            .hno(request.getHno())
            .Street1(request.getStreet1())
            .Street2(request.getStreet2())
            .Pin_Code(request.getPin_Code())
            .State(request.getState())
            .City(request.getCity())
            .Country(request.getCountry())
            .District(request.getDistrict())
            .Mobile(request.getMobile())
            .dob(request.getDob())
            .dor(request.getDor())
            .build();
    try {
      var detailSaved = userDetailRepository.save(userDetail);
    }
    catch (Exception e){
//      repository.delete(user_id);
      System.out.println(e+"");
    }
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .id(user_id.getId())
            .role(request.getRole().toString())
        .build();
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(),
            request.getPassword()
        )
    );
    var user = repository.findByEmail(request.getEmail())
        .orElseThrow();

    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    revokeAllUserTokens(user);
    saveUserToken(user, jwtToken);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .id(user.getId())
            .role(user.getRole().toString())
        .build();
  }

  private void saveUserToken(User user, String jwtToken) {
    var token = Token.builder()
        .user(user)
        .token(jwtToken)
        .tokenType(TokenType.BEARER)
        .expired(false)
        .revoked(false)
        .build();
    tokenRepository.save(token);
  }

  private void revokeAllUserTokens(User user) {
    var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
    if (validUserTokens.isEmpty())
      return;
    validUserTokens.forEach(token -> {
      token.setExpired(true);
      token.setRevoked(true);
    });
    tokenRepository.saveAll(validUserTokens);
  }

  public void refreshToken(
          HttpServletRequest request,
          HttpServletResponse response
  ) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;
    if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
      return;
    }
    refreshToken = authHeader.substring(7);
    userEmail = jwtService.extractUsername(refreshToken);
    if (userEmail != null) {
      var user = this.repository.findByEmail(userEmail)
              .orElseThrow();
      if (jwtService.isTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);
        var authResponse = AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }

  public String resetPasswods(AuthenticationRequest request) {
    Optional<User> user = repository.findByEmail(request.getEmail());
    if(user.isPresent()){
      User user1 = user.get();
      user1.setPassword(passwordEncoder.encode(request.getPassword()));
      try {
        repository.save(user1);
      }
      catch (Exception e){
        System.out.println(e+"");
      }
    }
    else{
      return "User Did Not Present";
    }

    return  "Reset Successfully";
  }
}



