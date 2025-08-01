import { useEffect, useState } from "react";
import { Container, Spinner, Modal } from "react-bootstrap";
import ItemList from "../components/items/ItemList";
import ItemForm from "../components/items/ItemForm";
import type { FormItemUIDto, ItemUIDto } from "../dtos/ItemUIDto";
import type { MainController as MainController } from "../../../adapters/controllers/MainController";
import type { MainPresenter } from "../../../adapters/presenters/MainPresenter";
import BottomActionHalo from "../components/common/BottomActionHalo";
import TopNavHalo from "../components/common/TopNavHalo";
import { Logger } from "../../../utils/Logger";
import { SettingsModal } from "./SettingsPage";
import type { OptionsController } from "../../../adapters/controllers/OptionsController";


interface MainPageProps {
  presenter: MainPresenter;
  mainController: MainController;
  optionsController: OptionsController;
}

export const MainPage: React.FC<MainPageProps> = ({ presenter, mainController, optionsController }) => {
  const [items, setItems] = useState<ItemUIDto[]>(presenter.Items.value);
  const [itemInEditing, setItemInEditing] = useState<ItemUIDto | null>(presenter.CurrentItem.value);
  const [isLoading, setIsLoading] = useState(presenter.IsLoading.value);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showEditCreateModal, setShowEditCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    const unsubItems = presenter.Items.subscribe(setItems);
    const unsubLoading = presenter.IsLoading.subscribe(setIsLoading);
    const unsubError = presenter.ErrorEvent.subscribe(setErrorMessage);

    return () => {
      unsubItems();
      unsubLoading();
      unsubError();
    };
  }, [presenter]);

  const handleAction = (action: 'filter' | 'add' | 'sort') => {
    Logger.log(`${action} action`);
    switch (action) {
      case 'add':
        setItemInEditing(null);
        setShowEditCreateModal(true);
        break;
      case 'filter':
        break;
      case 'sort':
        break;
    }
  };

  const handleSave = async (item: FormItemUIDto | null) => {
    if (!item)
      return;

    const itemToSave = {
      id: item.id ?? "",
      name: item.name,
      description: item.description,
      images: item.images.map(image => ({
        id: image.id ?? "",
        name: image.name,
        mimeType: image.mimeType,
        contentBase64: image.contentBase64
      }))
    };
    if (item.id) {
      await mainController.updateItem(itemToSave);
    } else {
      await mainController.createItem(itemToSave);
    }
    setShowEditCreateModal(false);
  };

  const handleAbort = async () => {
    setShowEditCreateModal(false);
  }

  const handleDelete = async (id: string | undefined) => {
    if (!id)
      return;
    await mainController.deleteItem(id);
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  function handleNavigation(page: 'info' | 'main' | 'settings'): void {
    Logger.log(`Open page ${page}`);
    switch(page){
      case 'settings':
        setShowSettingsModal(true);
        break;
    }
  }

  return (
    <Container className="page-content-container">

      {/* Navigation bar */}
      <TopNavHalo handleNavigation={handleNavigation} />

      {/* Error box */}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Content list */}
      <ItemList
        items={items}
        onEdit={(house) => {
          setItemInEditing(house);
          setShowEditCreateModal(true);
        }}
        onDelete={handleDelete}
      />

      {/* Actions bar */}
      <BottomActionHalo handleAction={handleAction} />

      {/* Modal Edit/Create */}
      <Modal show={showEditCreateModal} size="lg" centered>
        <Modal.Header>
          <Modal.Title>
            {itemInEditing ? "Edit" : "Create"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ItemForm item={itemInEditing} onSubmit={handleSave} onAbort={handleAbort} />
        </Modal.Body>
      </Modal>

      {/* Modal Options */}
      <SettingsModal
        controller={optionsController}
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

    </Container>
  );
}

