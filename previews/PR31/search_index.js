var documenterSearchIndex = {"docs":
[{"location":"interface/#Low-level-interfaces-for-customizations","page":"Low-level interfaces for customizations","title":"Low-level interfaces for customizations","text":"","category":"section"},{"location":"interface/","page":"Low-level interfaces for customizations","title":"Low-level interfaces for customizations","text":"Atomix.IndexableRef\nAtomix.get\nAtomix.set!\nAtomix.modify!\nAtomix.replace!\nAtomix.swap!","category":"page"},{"location":"interface/#Atomix.IndexableRef","page":"Low-level interfaces for customizations","title":"Atomix.IndexableRef","text":"Atomix.IndexableRef{Indexable}\n\nAn object IndexableRef(data, indices) represents a reference to the location data[indices...].\n\nA reference object supports Atomix.pointer, Atomix.asstorable, and eltype:\n\njulia> using Atomix\n\njulia> a = [111, 222, 333];\n\njulia> ref = Atomix.IndexableRef(a, (1,));\n\njulia> Atomix.pointer(ref) === pointer(a, 1)\ntrue\n\njulia> Atomix.asstorable(ref, 1.0)\n1\n\njulia> eltype(ref)\nInt64\n\nTo customize the behavior of atomic updates of an Indexable, define the following methods:\n\nAtomix.get(ref::Atomix.IndexableRef{Indexable}, order) -> v::eltype(ref)\nAtomix.set!(ref::Atomix.IndexableRef{Indexable}, v, order)\nAtomix.replace!(ref::Atomix.IndexableRef{Indexable}, expected, desired, success_order, failure_order) -> (; old, success).\nAtomix.modify!(ref::Atomix.IndexableRef{Indexable}, op, x, order) -> (old => new)\n\nThe ordering arguments (order, success_order, and failure_order) are one of:\n\nAtomix.monotonic\nAtomix.acquire\nAtomix.release\nAtomix.acquire_release (Atomix.acq_rel)\nAtomix.sequentially_consistent (Internal.seq_cst)\n\n\n\n\n\n","category":"type"},{"location":"interface/#Atomix.get","page":"Low-level interfaces for customizations","title":"Atomix.get","text":"Atomix.get(ref, order) -> x\nAtomix.get(ref) -> x\n\nAtomically load the value x stored in ref with ordering order.  The default ordering Atomix.sequentially_consistent is used when not specified.\n\nExamples\n\njulia> using Atomix\n\njulia> a = [111, 222, 333];\n\njulia> ref = Atomix.IndexableRef(a, (1,));\n\njulia> Atomix.get(ref)\n111\n\n\n\n\n\n","category":"function"},{"location":"interface/#Atomix.set!","page":"Low-level interfaces for customizations","title":"Atomix.set!","text":"Atomix.set!(ref, x, order)\nAtomix.set!(ref, x)\n\nAtomically store the value x in ref with ordering order.  The default ordering Atomix.sequentially_consistent is used when not specified.\n\nExamples\n\njulia> using Atomix\n\njulia> a = [111, 222, 333];\n\njulia> ref = Atomix.IndexableRef(a, (1,));\n\njulia> Atomix.set!(ref, 123);\n\njulia> a[1]\n123\n\n\n\n\n\n","category":"function"},{"location":"interface/#Atomix.modify!","page":"Low-level interfaces for customizations","title":"Atomix.modify!","text":"Atomix.modify!(ref, op, x, order) -> (old => new)\nAtomix.modify!(ref, op, x) -> (old => new)\n\nAtomically update ref from stored value old to new = op(old, x) with ordering order (default: Atomix.sequentially_consistent).  Return a pair old => new.\n\nExamples\n\njulia> using Atomix\n\njulia> a = [111, 222, 333];\n\njulia> ref = Atomix.IndexableRef(a, (1,));\n\njulia> Atomix.modify!(ref, +, 123)\n111 => 234\n\n\n\n\n\n","category":"function"},{"location":"interface/#Atomix.replace!","page":"Low-level interfaces for customizations","title":"Atomix.replace!","text":"Atomix.replace!(ref, expected, desired, success_order, fail_order) -> (; old, success)\nAtomix.replace!(ref, expected, desired, order) -> (; old, success)\nAtomix.replace!(ref, expected, desired) -> (; old, success)\n\nAtomically replace the value stored in ref to desired if expected is stored.  A named tuple (; old::eltype(ref), success::Bool) is returned.\n\nExamples\n\njulia> using Atomix\n\njulia> a = [111, 222, 333];\n\njulia> ref = Atomix.IndexableRef(a, (1,));\n\njulia> Atomix.replace!(ref, 111, 123)\n(old = 111, success = true)\n\n\n\n\n\n","category":"function"},{"location":"interface/#Atomix.swap!","page":"Low-level interfaces for customizations","title":"Atomix.swap!","text":"Atomix.swap!(ref, new, order) -> old\nAtomix.swap!(ref, new) -> old\n\nSwap the old stored in ref with the new value and establish the memory ordering order (default: Atomix.sequentially_consistent).\n\nNotes for implementers: Atomix.swap!(ref, new, order) is defined as Atomix.modify!(ref, Atomix.right, x, order).  Thus, only Atomix.modify! has to be defined.\n\nExamples\n\njulia> using Atomix\n\njulia> a = [111, 222, 333];\n\njulia> ref = Atomix.IndexableRef(a, (1,));\n\njulia> Atomix.swap!(ref, 123)\n111\n\njulia> a[1]\n123\n\n\n\n\n\n","category":"function"},{"location":"#Atomix.jl","page":"Atomix.jl","title":"Atomix.jl","text":"","category":"section"},{"location":"","page":"Atomix.jl","title":"Atomix.jl","text":"Atomix\nAtomix.@atomic\nAtomix.@atomicswap\nAtomix.@atomicreplace","category":"page"},{"location":"#Atomix","page":"Atomix.jl","title":"Atomix","text":"Atomix\n\n(Image: Dev) (Image: CI)\n\nAtomix.jl implements @atomic, @atomicswap, and @atomicreplace that are superset of the macros in Base.  In addition to atomic operations on the fields as implemented in Base, they support atomic operations on array elements.\n\njulia> using Atomix: @atomic, @atomicswap, @atomicreplace\n\njulia> A = ones(Int, 3);\n\njulia> @atomic A[1] += 1;  # fetch-and-increment\n\njulia> @atomic A[1]\n2\n\njulia> @atomicreplace A[begin+1] 1 => 42  # compare-and-swap\n(old = 1, success = true)\n\njulia> @inbounds @atomic :monotonic A[begin+1]  # specify ordering and skip bound check\n42\n\njulia> @atomicswap A[end] = 123\n1\n\njulia> A[end]\n123\n\n\n\n\n\n","category":"module"},{"location":"#Atomix.@atomic","page":"Atomix.jl","title":"Atomix.@atomic","text":"Atomix.@atomic\n\nA superset of Base.@atomic supporting atomic operations on array elements. Atomic operations on fields dispatches to Base.@atomic.\n\n\n\n\n\n","category":"macro"},{"location":"#Atomix.@atomicswap","page":"Atomix.jl","title":"Atomix.@atomicswap","text":"Atomix.@atomicswap\n\nA superset of Base.@atomicswap supporting atomic operations on array elements. Atomic operations on fields dispatches to Base.@atomicswap.\n\n\n\n\n\n","category":"macro"},{"location":"#Atomix.@atomicreplace","page":"Atomix.jl","title":"Atomix.@atomicreplace","text":"Atomix.@atomicreplace\n\nA superset of Base.@atomicreplace supporting atomic operations on array elements.  Atomic operations on fields dispatches to Base.@atomicreplace.\n\n\n\n\n\n","category":"macro"}]
}