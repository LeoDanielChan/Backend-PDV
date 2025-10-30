import { prisma } from "@/config/prismaClient";
import { IUpdateProfileRequest } from "@/domain/models/IProfile";

export class ProfileUser {
  async updateProfile(userId: number, data: IUpdateProfileRequest): Promise<any> {
    // Actualiza datos en usuarios
    const usuarioUpdate: any = {};
    if (data.correo) usuarioUpdate.correo = data.correo;
    if (data.id_archivo_perfil) usuarioUpdate.id_archivo_perfil = data.id_archivo_perfil;
    if (Object.keys(usuarioUpdate).length > 0) {
      await prisma.usuarios.update({
        where: { usuario_id: userId },
        data: usuarioUpdate,
      });
    }

    // Actualiza datos en personas
    const personaUpdate: any = {};
    if (data.nombre) personaUpdate.nombre = data.nombre;
    if (data.ap_paterno) personaUpdate.ap_paterno = data.ap_paterno;
    if (data.ap_materno) personaUpdate.ap_materno = data.ap_materno;
    if (data.genero !== undefined) personaUpdate.genero = data.genero;
    if (data.fecha_nacimiento) personaUpdate.fecha_nacimiento = new Date(data.fecha_nacimiento);
    if (data.rfc) personaUpdate.rfc = data.rfc;
    if (data.ine) personaUpdate.ine = data.ine;
    if (data.telefono) personaUpdate.telefono = data.telefono;
    if (Object.keys(personaUpdate).length > 0) {
      const usuario = await prisma.usuarios.findUnique({ where: { usuario_id: userId } });
      if (usuario) {
        await prisma.personas.update({
          where: { persona_id: usuario.id_persona },
          data: personaUpdate,
        });
      }
    }

    // Actualiza datos de empleado si existe
    if (data.empleado) {
      await prisma.empleado.updateMany({
        where: { id_usuario: userId },
        data: data.empleado,
      });
    }

    return { message: "Perfil actualizado" };
  }
}
