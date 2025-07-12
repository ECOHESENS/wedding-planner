'use client'

import { useState } from 'react'
import { Attendee, RELATIONSHIP_TYPES } from '@/types/attendees'
import { 
  UserGroupIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

interface FamilyTreeProps {
  attendees: Attendee[]
  onAddFamilyMember: (parentId: string, relationshipType: string) => void
}

interface FamilyNode {
  attendee: Attendee
  children: FamilyNode[]
}

export default function FamilyTree({ attendees, onAddFamilyMember }: FamilyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Build family tree structure
  const buildFamilyTree = (): FamilyNode[] => {
    const rootNodes: FamilyNode[] = []
    const nodeMap = new Map<string, FamilyNode>()

    // Create nodes for all attendees
    attendees.forEach(attendee => {
      nodeMap.set(attendee.id, { attendee, children: [] })
    })

    // Build tree structure
    attendees.forEach(attendee => {
      const node = nodeMap.get(attendee.id)!
      if (attendee.parentId && nodeMap.has(attendee.parentId)) {
        nodeMap.get(attendee.parentId)!.children.push(node)
      } else if (!attendee.parentId) {
        rootNodes.push(node)
      }
    })

    return rootNodes
  }

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderNode = (node: FamilyNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children.length > 0
    const isExpanded = expandedNodes.has(node.attendee.id)
    const { attendee } = node

    // Get relationship icon based on type
    const getRelationshipIcon = () => {
      if (attendee.relationshipType?.includes('mere')) return '👩'
      if (attendee.relationshipType?.includes('pere')) return '👨'
      if (attendee.relationshipType?.includes('soeur')) return '👩‍🦰'
      if (attendee.relationshipType?.includes('frere')) return '👨‍🦰'
      if (attendee.relationshipType?.includes('grand_mere')) return '👵'
      if (attendee.relationshipType?.includes('grand_pere')) return '👴'
      if (attendee.relationshipType?.includes('tante')) return '👩‍🦱'
      if (attendee.relationshipType?.includes('oncle')) return '👨‍🦱'
      if (attendee.relationshipType?.includes('cousine')) return '👩‍🦳'
      if (attendee.relationshipType?.includes('cousin')) return '👨‍🦳'
      return '👤'
    }

    return (
      <div key={attendee.id} className="select-none">
        <div 
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
            level === 0 ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' : ''
          }`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          <button
            onClick={() => hasChildren && toggleNode(attendee.id)}
            className={`p-1 rounded ${hasChildren ? 'hover:bg-gray-200 dark:hover:bg-gray-600' : 'invisible'}`}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>

          <span className="text-2xl">{getRelationshipIcon()}</span>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {attendee.firstName} {attendee.lastName}
              </span>
              {attendee.relationshipType && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({RELATIONSHIP_TYPES[attendee.relationshipType as keyof typeof RELATIONSHIP_TYPES] || attendee.relationshipType})
                </span>
              )}
              {attendee.specialRole && attendee.specialRole.length > 0 && (
                <div className="flex gap-1">
                  {attendee.specialRole.map(role => (
                    <span key={role} className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                      {role}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className={`px-2 py-0.5 rounded-full ${
                attendee.side === 'marie' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                attendee.side === 'mariee' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' :
                'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {attendee.side === 'marie' ? '🤵 Marié' : attendee.side === 'mariee' ? '👰 Mariée' : '👥 Commun'}
              </span>
              {attendee.confirmed && (
                <span className="text-green-600 dark:text-green-400">✅ Confirmé</span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddFamilyMember(attendee.id, '')}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Ajouter un membre de la famille"
          >
            <UserPlusIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const familyTree = buildFamilyTree()
  const brideFamily = familyTree.filter(node => node.attendee.side === 'mariee')
  const groomFamily = familyTree.filter(node => node.attendee.side === 'marie')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <UserGroupIcon className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">🌳 Organigramme Familial</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bride's Family */}
        <div>
          <h3 className="text-lg font-medium text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
            <span className="text-2xl">👰</span> Famille de la Mariée
          </h3>
          <div className="space-y-2">
            {brideFamily.length > 0 ? (
              brideFamily.map(node => renderNode(node))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                Aucun membre de la famille ajouté
              </p>
            )}
          </div>
        </div>

        {/* Groom's Family */}
        <div>
          <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span className="text-2xl">🤵</span> Famille du Marié
          </h3>
          <div className="space-y-2">
            {groomFamily.length > 0 ? (
              groomFamily.map(node => renderNode(node))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                Aucun membre de la famille ajouté
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <p className="text-sm text-purple-700 dark:text-purple-300">
          💡 <strong>Astuce:</strong> Cliquez sur le bouton + pour ajouter des membres de la famille. 
          L'organigramme s'organise automatiquement selon les relations familiales.
        </p>
      </div>
    </div>
  )
}