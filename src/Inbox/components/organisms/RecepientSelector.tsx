import React, { useState, useEffect } from 'react';
import { FormField } from '../molecules/FormField';
import { DropdownButton } from '../molecules/DropdownButton';
import { DropdownMenu } from '../molecules/DropdownMenu';
import { RecipientItem } from '../molecules/RecipientItem';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

interface User {
  id: number;
  name: string;
  type?: 'staff' | 'group';
  role?: string;
}

interface RecipientsSelectorProps {
  selectedRecipients: string[];
  onRecipientsChange: (recipients: string[]) => void;
  users: User[];
  groups: User[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

type RecipientFilter = 'all' | 'staff' | 'groups';

export const RecipientsSelector: React.FC<RecipientsSelectorProps> = ({
  selectedRecipients,
  onRecipientsChange,
  users,
  groups,
  loading = false,
  error = null,
  onRetry
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<RecipientFilter>('all');
  const [search, setSearch] = useState('');

  const allRecipients = [...users, ...groups];

  const getFilteredRecipients = (): User[] => {
    let recipients = allRecipients;

    if (filter === 'staff') {
      recipients = recipients.filter((r) => r.type === 'staff');
    } else if (filter === 'groups') {
      recipients = recipients.filter((r) => r.type === 'group');
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      recipients = recipients.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          (r.role && r.role.toLowerCase().includes(searchLower))
      );
    }

    return recipients;
  };

  const filteredRecipients = getFilteredRecipients();
  const selectedCount = selectedRecipients.length;
  const totalCount = filteredRecipients.length;

  const handleSelectAll = () => {
    const allNames = filteredRecipients.map((r) => r.name);
    const newRecipients = [...new Set([...selectedRecipients, ...allNames])];
    onRecipientsChange(newRecipients);
  };

  const handleClearAll = () => {
    onRecipientsChange([]);
  };

  const toggleRecipient = (recipientName: string) => {
    const newRecipients = selectedRecipients.includes(recipientName)
      ? selectedRecipients.filter((r) => r !== recipientName)
      : [...selectedRecipients, recipientName];
    onRecipientsChange(newRecipients);
  };

  useEffect(() => {
    setSearch('');
  }, [filter]);

  return (
    <FormField label="Recipients/Assignees" required>
      <div className="relative w-full">
        <DropdownButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
          placeholder="Search staff or groups..."
        >
          {loading ? (
            <span className="text-gray-500">Loading users...</span>
          ) : selectedCount === 1 ? (
            <span className="text-sm text-gray-900">{selectedRecipients[0]}</span>
          ) : selectedCount > 1 ? (
            <span className="text-sm text-gray-900">{selectedCount} selected</span>
          ) : null}
        </DropdownButton>

        <DropdownMenu isOpen={isOpen && !loading} className="min-w-[320px]">
          <div className="p-3 bg-white">
            <div className="flex flex-col gap-1">
              {/* Filter Tabs */}
              <div className="flex gap-1 mb-1">
                {(['all', 'staff', 'groups'] as const).map((filterOption) => (
                  <button
                    key={filterOption}
                    type="button"
                    onClick={() => setFilter(filterOption)}
                    className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      filter === filterOption
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {filterOption}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="mb-3"
              />

              {/* Selection Controls */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <span className="text-sm font-medium text-gray-700">
                  {selectedCount} of {totalCount} selected
                </span>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <span className="text-gray-300 text-sm">|</span>
                  <Button variant="ghost" size="sm" onClick={handleClearAll}>
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Recipients List */}
              <ul className="max-h-80 overflow-auto bg-white" role="listbox">
                {error ? (
                  <li className="px-4 py-3">
                    <div className="text-red-500 text-sm">
                      {error}
                      {onRetry && (
                        <button
                          onClick={onRetry}
                          className="ml-2 text-blue-500 hover:text-blue-700 underline"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </li>
                ) : filteredRecipients.length === 0 ? (
                  <li className="px-4 py-3">
                    <div className="text-gray-500 text-sm">No recipients found</div>
                  </li>
                ) : (
                  filteredRecipients.map((recipient) => (
                    <RecipientItem
                      key={recipient.id}
                      recipient={recipient}
                      isSelected={selectedRecipients.includes(recipient.name)}
                      onToggle={() => toggleRecipient(recipient.name)}
                    />
                  ))
                )}
              </ul>
            </div>
          </div>
        </DropdownMenu>
      </div>
    </FormField>
  );
};