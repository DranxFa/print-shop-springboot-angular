package com.printing.managment.controller;

import com.printing.managment.dto.UsuarioRequest;
import com.printing.managment.dto.UsuarioResponse;
import com.printing.managment.model.Usuario;
import com.printing.managment.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscar(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(convertirAUsuarioResponse(usuario));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> buscarTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();

        return ResponseEntity.ok(usuarios.stream().map(this::convertirAUsuarioResponse).toList());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> crear(@RequestBody UsuarioRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setEmail(request.email());

        usuario.setPasswordHash(passwordEncoder.encode(request.password()));

        usuario.setRol(request.rol());

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        return ResponseEntity.ok(convertirAUsuarioResponse(usuarioGuardado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private UsuarioResponse convertirAUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(),
                usuario.getEmail(), usuario.getRol());
    }
}
