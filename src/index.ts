import type { LibraryRegistry } from "@vertigis/web/config";
import CustomUNDiagramService from "./services/CustomUNDiagramService/CustomUNDiagramService"

//const LAYOUT_NAMESPACE = "custom.9f024569";

export default function (registry: LibraryRegistry): void {
    registry.registerService({
        id:"CustomUNDiagramService",
        getService: () => new CustomUNDiagramService(),
    })

    registry.registerCommand({
        name: "CustomUNDiagramService.AddDiagramFromResults",
        serviceId: "CustomUNDiagramService",
    });
}
