import { useState, useEffect, PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'
import { PostgresTable } from '@supabase/postgres-meta'

import { useStore, withAuth } from 'hooks'
import Error from 'components/ui/Error'
import ProjectLayout from '../ProjectLayout/ProjectLayout'
import TableEditorMenu from './TableEditorMenu'
import { isUndefined } from 'lodash'

interface Props {
  selectedSchema?: string
  onSelectSchema: (schema: string) => void
  onAddTable: () => void
  onEditTable: (table: PostgresTable) => void
  onDeleteTable: (table: PostgresTable) => void
  onDuplicateTable: (table: PostgresTable) => void
}

const TableEditorLayout = ({
  selectedSchema,
  onSelectSchema = () => {},
  onAddTable = () => {},
  onEditTable = () => {},
  onDeleteTable = () => {},
  onDuplicateTable = () => {},
  children,
}: PropsWithChildren<Props>) => {
  const { meta, ui } = useStore()
  const { isInitialized, isLoading, error } = meta.tables

  const [loaded, setLoaded] = useState<boolean>(isInitialized)

  useEffect(() => {
    if (ui.selectedProject) {
      meta.schemas.load()
      meta.tables.load()
      meta.types.load()
    }
  }, [ui.selectedProject])

  useEffect(() => {
    let cancel = false
    if (!isLoading && !loaded) {
      if (!cancel) setLoaded(true)
    }
    return () => {
      cancel = true
    }
  }, [isLoading])

  if (error) {
    return (
      <ProjectLayout>
        <Error error={error} />
      </ProjectLayout>
    )
  }

  return (
    <ProjectLayout
      isLoading={!loaded || isUndefined(selectedSchema)}
      product="Table editor"
      productMenu={
        <TableEditorMenu
          selectedSchema={selectedSchema}
          onSelectSchema={onSelectSchema}
          onAddTable={onAddTable}
          onEditTable={onEditTable}
          onDeleteTable={onDeleteTable}
          onDuplicateTable={onDuplicateTable}
        />
      }
    >
      {children}
    </ProjectLayout>
  )
}

export default withAuth(observer(TableEditorLayout))
