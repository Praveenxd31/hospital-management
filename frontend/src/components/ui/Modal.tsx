import type { ReactNode } from 'react'

interface ModalProps {
  id: string
  title: string
  children: ReactNode
}

export const Modal = ({ id, title, children }: ModalProps) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export const openModal = (id: string) => {
  const el = document.getElementById(id) as HTMLDialogElement
  el?.showModal()
}

export const closeModal = (id: string) => {
  const el = document.getElementById(id) as HTMLDialogElement
  el?.close()
}