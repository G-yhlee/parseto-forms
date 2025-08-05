// Icon mappings using Lucide Svelte - latest version correct import
import {
  Database,
  Folder,
  Users,
  Car,
  UserCheck,
  Plane,
  FileText,
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Info,
  Calendar,
  Hash,
  Type,
  ToggleLeft,
  Code,
  Eye,
  EyeOff,
  Menu,
  Home,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  LogOut
} from 'lucide-svelte';

// Type for icon components - using any for simplicity with lucide-svelte
type IconComponent = any;

/**
 * Icon utility class for consistent icon usage across the application
 */
export class IconUtils {
  
  /**
   * Get appropriate icon for collection based on name and type
   */
  static getCollectionIcon(collectionName: string): IconComponent {
    const name = collectionName.toLowerCase();
    
    // User-related collections
    if (name.includes('user') || name.includes('auth')) {
      return Users;
    }
    
    // EBOS specific collections
    if (name.includes('carinfo') || name.includes('car')) {
      return Car;
    }
    
    if (name.includes('customer') || name.includes('passenger')) {
      return UserCheck;
    }
    
    if (name.includes('r1s') || name.includes('r2s')) {
      return Plane;
    }
    
    // Default collection icon
    return Database;
  }
  
  /**
   * Get icon for data field types
   */
  static getFieldTypeIcon(fieldType: string): IconComponent {
    switch (fieldType.toLowerCase()) {
      case 'datetime':
      case 'date':
        return Calendar;
      case 'number':
      case 'int':
        return Hash;
      case 'text':
      case 'string':
        return Type;
      case 'bool':
      case 'boolean':
        return ToggleLeft;
      case 'json':
      case 'object':
        return Code;
      default:
        return FileText;
    }
  }
  
  /**
   * Get status icon for boolean values
   */
  static getBooleanIcon(value: boolean): IconComponent {
    return value ? Check : X;
  }
  
  /**
   * Get visibility icon
   */
  static getVisibilityIcon(isVisible: boolean): IconComponent {
    return isVisible ? Eye : EyeOff;
  }
  
  /**
   * Common UI icons
   */
  static readonly UI = {
    // Actions
    Search,
    Filter,
    Plus,
    Edit,
    Trash: Trash2,
    Download,
    Upload,
    Refresh: RefreshCw,
    
    // Navigation
    ChevronDown,
    ChevronRight,
    ArrowRight,
    ArrowLeft,
    Menu,
    Home,
    ExternalLink,
    
    // Status
    X,
    Check,
    AlertCircle,
    Info,
    
    // Data
    Database,
    Folder,
    FileText,
    Settings,
    LogOut
  };
}

// Export commonly used icons for direct import
export {
  Database,
  Folder,
  Users,
  Car,
  UserCheck,
  Plane,
  FileText,
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Info,
  Calendar,
  Hash,
  Type,
  ToggleLeft,
  Code,
  Eye,
  EyeOff,
  Menu,
  Home,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  LogOut
};