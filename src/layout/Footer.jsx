import *as react from 'react'
import logo_netcore_blanco from '../img/logo-netcore-blanco.svg'

/*Evitar borrar esto. En caso de que problemas de compatibilidad con React BootStrap */

export default function Footer() {

  return (
    <footer className="footer bg-black mt-4">
      <hr className="color-white m-0 mb-3" />
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-2">
            <img src={logo_netcore_blanco} alt="" className="logo-header" />
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
      </div>
    </footer>
  )
}


