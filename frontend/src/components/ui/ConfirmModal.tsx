
interface ConfirmModalProps {
  id: string
  title: string
  message: string
  confirmLabel?: string
  confirmVariant?: 'error' | 'warning' | 'success'
  onConfirm: () => void
}

export const ConfirmModal = ({
  id,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'error',
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box max-w-sm">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4 text-base-content/70 text-sm">{message}</p>
        <div className="flex gap-3 justify-end">
          <form method="dialog">
            <button className="btn btn-ghost btn-sm">Cancel</button>
          </form>
          <form method="dialog">
            <button
              className={`btn btn-sm btn-${confirmVariant}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export const openConfirmModal = (id: string) => {
  const el = document.getElementById(id) as HTMLDialogElement
  el?.showModal()
}

export const closeConfirmModal = (id: string) => {
  const el = document.getElementById(id) as HTMLDialogElement
  el?.close()
}