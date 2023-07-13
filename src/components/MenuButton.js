import { Dropdown } from "react-bootstrap";

export default function MenuButton({ children, items = {} }) {
  return (
    <Dropdown>
      <Dropdown.Toggle className="d-flex h-100 align-items-center p-2">{children}</Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.entries(items).map(
          ([text, func], index) =>
            func && (
              <Dropdown.Item key={index} onClick={func}>
                {text ?? "action"}
              </Dropdown.Item>
            )
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
