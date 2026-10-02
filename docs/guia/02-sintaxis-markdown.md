# Sintaxis Markdown

Se usa Markdown con extensiones de GitHub (*GFM*): tablas, listas de tareas, tachado y bloques de código.

## Texto

**Negrita**, *cursiva*, ~~tachado~~ y `código en línea`.

> Una cita sencilla.

## Listas

- Elemento
  - Subelemento
- Otro elemento

1. Primero
2. Segundo

- [x] Tarea hecha
- [ ] Tarea pendiente

## Avisos

Cinco tipos, con la misma sintaxis que GitHub:

> [!NOTE]
> Información adicional.

> [!TIP]
> Un consejo útil.

> [!IMPORTANT]
> Algo que no conviene pasar por alto.

> [!WARNING]
> Cuidado con esto.

> [!CAUTION]
> Puede causar pérdida de datos.

```markdown
> [!WARNING]
> Cuidado con esto.
```

## Código

Con resaltado de sintaxis y botón **Copiar** (aparece al pasar el ratón):

```python
def saludar(nombre: str) -> str:
    return f"Hola, {nombre}"
```

El resaltado cubre los lenguajes más habituales: `bash`, `js`, `ts`, `json`, `yaml`, `python`, `html`, `css`, `sql`, `java`, `go`, `rust`, `c`, `cpp`, `csharp`, `php`, `ruby`, `diff`, entre otros. Un bloque sin lenguaje se muestra sin colores.

## Tablas

| Columna A | Columna B | Columna C |
| --------- | :-------: | --------: |
| izquierda | centro    | derecha   |
| 1         | 2         | 3         |

Las tablas anchas se desplazan en horizontal en pantallas pequeñas.

## HTML

Puedes escribir HTML dentro de un `.md` cuando Markdown no alcance. Es lo que usan los [recuadros de portada](03-portada-y-recuadros.md).

> [!CAUTION]
> El HTML de los `.md` se inserta tal cual, sin filtrar. Solo publica contenido en el que confíes, y revisa los cambios de colaboradores externos.
