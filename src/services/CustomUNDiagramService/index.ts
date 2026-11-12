import type { LibraryRegistry } from "@vertigis/web/config";

import CustomUNDiagramService from "./CustomUNDiagramService";

export default function(registry: LibraryRegistry) {

    registry.registerService({
        id: "CustomUNDiagramService",
        getService: () => new CustomUNDiagramService(),
    });
}