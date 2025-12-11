/* Evitar borrar esto. En caso de que problemas de compatibilidad con React BootStrap */

export default function Footer() {
  return (
    <footer className="footer bg-black mt-4 py-4">
      <hr className="color-white m-0 mb-3" />
      <div className="container d-flex align-items-center">
        <div className="me-4 flex-shrink-0">
          <img
            src="/img/logo-netcore-blanco.svg"
            alt="Netcore"
            className="logo-header"
            height={90}
          />
        </div>
         <div className="col-12 col-md-10 aling-center">
            <p className="color-white text-center">
              Empresas Castellano Ltda. <br />
              <a href="http://www.netcore.cl" target="_blank" rel="noopener noreferrer" className="color-white">
                http://www.netcore.cl
              </a>, 2000 - 2025. Nueva de Lyon 72 of. 1601, Providencia, Chile. <br />
              Recursos Humanos y Contabilidad: <a href="mailto:soporte_rrhh@netcore.cl" className="color-white">soporte_rrhh@netcore.cl</a> <br />
              Educación: <a href="mailto:soporte@netcore.cl" className="color-white">soporte@netcore.cl</a>
            </p>
          </div>
      </div>
    </footer>
  );
}
