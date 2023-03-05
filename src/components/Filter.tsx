import React, {useEffect} from 'react';
import { Button, Group, Text, Select, Box, Input, Flex, Center, Divider, CloseButton } from '@mantine/core';
import { faker } from '@faker-js/faker';

interface IConditionFilter {
  id: string;
  on: string;
  condition: Condition;
  to: string;
  group?: IConditionGroup | IConditionGroup[];
}

interface IConditionGroup {
  id: string;
  relation: Relation;
  conditions: IConditionFilter[];
}

enum Relation {
  and = 'and',
  or = 'or',
  not = 'not',
}

enum Condition {
  is = 'is',
  isNot = 'is not',
  includes = 'includes',
}

//DummyData
const DATA = [
  "Time",
  "Name",
  "Account",
  "Animal",
  "Git"
]


function getFakeData(type: string) {
  switch (type) {
    case 'Name':
      //generate 10 random names
      return Array.from({ length: 10 }, () => faker.name.firstName());
    case 'Account':
      return Array.from({ length: 10 }, () => faker.finance.account());
    case 'Animal':
      return Array.from({ length: 10 }, () => faker.animal.type());
    case 'Git':
      return Array.from({ length: 10 }, () => faker.git.branch());
    default:
      return Array.from({ length: 10 }, () => faker.name.firstName());
  }
}


export default function FilterUi (props:{
  closeWindow:React.Dispatch<React.SetStateAction<boolean>>
}) {
//Idea
  const [appliedFilters, setAppliedFilters] = React.useState<IConditionFilter[]>([
    {
      id: '1',
      on: 'Git',
      condition: Condition.is,
      to:'',
      group:[]
    },
  ]);

  const createNewFilterObject=()=>{
    return {
      relation: Relation.and,
      id: Math.random().toString(36).substring(7),
      on: DATA[Math.floor(Math.random() * DATA.length)],
      condition: Condition.is,
      to: 'On',
      group:[]
    }
  }

  function deleteConditionFromGroup(group: IConditionGroup[], id: string) {
    group.forEach((g: IConditionGroup) => {
      if (g.conditions) {
        g.conditions = g.conditions.filter((filter: any) => {
          if (filter.id === id) {
            return false
          }
          if (filter.group) {
            deleteConditionFromGroup(filter.group, id)
          }
          return true
        })
      }
    })
  }

  function deleteCondition(id:string){
    let newFilters = appliedFilters.filter((filter:any)=>{
      if (filter.id === id) {
        return false
      }
      if (filter.group) {
        deleteConditionFromGroup(filter.group, id)
      }
      return true
    })
    setAppliedFilters(newFilters)
  }

function addFilter(id:string,groupId?:string){
  console.log(id,"groupId",groupId);
  let newFilters = [...appliedFilters]
  if(id==="new"){
    newFilters.push(
      createNewFilterObject()
    )
  }else if(groupId!=="none"){
  //finding the group recursively and adding the new filter
  function adder(filters:any){
    return filters.forEach((filter:any)=>{
      if (filter.group && filter.group.length && filter.group[0].id === groupId){
        console.log("Found the group");
        filter.group[0].conditions.push(createNewFilterObject())
      }
      if(filter.group || filter.conditions){
         adder(filter.group?filter.group:filter.conditions)
      }
    }
    )
  }
  adder(newFilters)

  } 
  else {
    newFilters.push(createNewFilterObject())
  }
  return setAppliedFilters(newFilters)
}

function addGroup(id:string) {
  console.log(id);
  //recursively finding the filter and adding the group
  let newFilters = [...appliedFilters]
  function adder(filters: any) {
    return filters.forEach((filter: any) => {
      console.log(filter);
      if (filter.id === id) {
        filter.group.push({
          id: Math.random().toString(36).substring(7),
          relation: Relation.and,
          conditions: [
            createNewFilterObject()
          ]
        })
      }
      if (filter.group && filter.group.length>0) {
        adder(filter.group[0].conditions)
      }
    })
  }
  adder(newFilters)
setAppliedFilters(newFilters)
}

//a recursive function to render the filters
  function RenderFilters (filters: any, type = "none", id = "none") {
    let filtersToRender:any = []
    filters.forEach((filter: any, idx: number,) => {
      filtersToRender.push(
        <Flex direction={'column'}>
        <Group>
           {idx===0? null :<>
              <RenderRelationSelector />
              <Divider size="sm" orientation="vertical" />
           </>
           }
            <RenderTaskSelector data={filter.on}/>
          <RenderConditionSelector/>
          {
            filter.on === 'Time' ? <RenderTimeSelector/> : <RenderTaskSelectorData data={filter.to}/>
          }
            <Button variant="subtle" radius="xs" size="xs"  onClick={()=>deleteCondition(filter.id)}>Del</Button>
          </Group>
          {
            type  && idx === filters.length-1  && <>
            <Group mt={5}>
              <Button variant="subtle" radius="xs" size="xs" onClick={()=>addFilter(filter.id, id)} >Add filter</Button>
                <Button variant="subtle" color="yellow" radius="xs" size="xs" onClick={() => addGroup(filter.id)} >Add Group</Button>
            </Group>
            </>
          }
        </Flex>
      )
      if (filter.group && filter.group.length>0 && filter.group[0].conditions.length>0 ) {
        filter.group.forEach((group:any) => {
          filtersToRender.push(
            <Flex
              sx={
                {
                  borderLeft: '2px solid #c5c3c6',
                }
              }
            pl={"lg"} direction={'column'} gap={5}>
             
              {RenderFilters(group.conditions, 'group' ,group.id)}
            </Flex>
          
          )
        })
      }
    })
  return filtersToRender
}

  return (
    <>
  <Center>
      <Box w="50%" sx={{
        borderRadius: '10px',
        position: 'relative',
      }} bg='white'
        p={10}
      >
      <CloseButton sx={{
        position: 'absolute',
        top: '10px',
        right: '10px',
      }} onClick={()=>props.closeWindow(false)}/>
          <Flex w='100%'  direction={'column'} gap={5}>
          <Text>Where</Text>
          {RenderFilters(appliedFilters)}
          <Group>
            <Button variant="subtle" radius="xs" size="xs" onClick={()=>addFilter("new")} >Add Filter</Button>
          </Group>
          </Flex>
        
      </Box>
  </Center>
   
    </>
  );
}

function RenderRelationSelector () {
  const condition = [
    "Where",
    "And",
    "Or"
  ]

  return (
    <Select
      searchable
      placeholder="Select condition"
      defaultValue={condition[0]}
      w={70}
      size="xs"
      data={condition}
    />
  );
}

function RenderConditionSelector() {
const condition=[
  "Is",
  "Is not",
  "Contains",
  "Does not contain",
  ]

  return (
    <Select
      searchable
      placeholder="Select condition"
      defaultValue={condition[0]}
      w={120}
      data={condition}
    />
  );
}

function RenderTaskSelector(props:{data:string}) {
  return (
    <Select
      searchable
      defaultValue={props.data}
      placeholder="Select task"
      data={DATA}
      w={120}
    />
  );
}

function RenderTaskSelectorData(data:any) {
  const d= getFakeData(data);

  return (
    <Select
      searchable
    defaultValue={d[0]}
    data={d}
    placeholder="Select task"
      w={120}
      />
  )
}


function RenderTimeSelector() {
  const time=[
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'This week', value: 'this_week' },
    { label: 'This month', value: 'this_month' },
  ]

  return (<Group>

    <Select
      searchable
      placeholder="Select time"
      data={time}
      w={100}
      size="xs"
      />
   <Input placeholder="Value" type={'number'} w={40} value={1} />
    <Select
    searchable
      placeholder="Select time"
      data={time}
      w={100}
      size="xs"
     
    />
      </Group>
  );
}