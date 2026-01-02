import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  description = 'Esta ação removerá o item de todas as áreas do sistema.',
  itemName,
}: DeleteConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        style={{
          background: 'rgba(0, 0, 0, 0.98)',
          border: '1px solid rgba(255, 0, 122, 0.4)',
          boxShadow: '0 0 40px rgba(255, 0, 122, 0.2)',
        }}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2 rounded-full"
              style={{
                background: 'rgba(255, 0, 122, 0.15)',
                border: '1px solid rgba(255, 0, 122, 0.3)',
              }}
            >
              <AlertTriangle
                className="w-5 h-5"
                style={{
                  color: '#FF007A',
                  filter: 'drop-shadow(0 0 6px #FF007A)',
                }}
              />
            </div>
            <AlertDialogTitle
              style={{
                color: '#FF007A',
                textShadow: '0 0 10px rgba(255, 0, 122, 0.5)',
              }}
            >
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription
            className="text-base"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            {itemName && (
              <span className="block mb-2">
                Tem certeza que deseja excluir{' '}
                <strong style={{ color: '#F8FAFC' }}>"{itemName}"</strong>?
              </span>
            )}
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 mt-4">
          <AlertDialogCancel
            className="transition-all duration-300"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="transition-all duration-300"
            style={{
              background: 'rgba(255, 0, 122, 0.15)',
              border: '1px solid #FF007A',
              color: '#FF007A',
              boxShadow: '0 0 15px rgba(255, 0, 122, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 122, 0.25)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 122, 0.5)';
              e.currentTarget.style.textShadow = '0 0 10px rgba(255, 0, 122, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 122, 0.15)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 122, 0.3)';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
