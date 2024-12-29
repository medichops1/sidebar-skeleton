import { Icon, Input } from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import { InputGroup } from '@/components/ui/input-group'

export const SearchField = () => {
  return (
    <InputGroup
      flex="1"
      startElement={
        <Icon size="sm">
          <LuSearch />
        </Icon>
      }
    >
      <Input placeholder="Search" />
    </InputGroup>
  )
}
